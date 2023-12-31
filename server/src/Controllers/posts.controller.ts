import { Request, Response } from "express";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { prisma, s3 } from "../server";
import { generateImageName, resizeImage } from "./../Services/images.service";

export const createPost = async (req: Request, res: Response) => {
    try {
        const bucketName = process.env.BUCKET_NAME;

        const resizedImageBuffer = await resizeImage(req.file.buffer, 1920, 1080);
        const imageName = generateImageName(req.file.originalname);

        const putObjectCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: imageName,
            Body: resizedImageBuffer,
            ContentType: req.file.mimetype,
        });

        await s3.send(putObjectCommand);

        const post = await prisma.posts.create({
            data: {
                caption: req.body.caption,
                imageName: imageName,
            },
        });

        res.status(200).json({
            status: "success",
            message: "Successfully uploaded the image to S3 Bucket",
            post,
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Something went wrong while uploading image to S3 Bucket",
            post: null,
        });
    }
};

export const getPosts = async (req: Request, res: Response) => {
    try {
        const modifiedPosts = [];
        const posts = await prisma.posts.findMany();

        const bucketName = process.env.BUCKET_NAME;

        for (const post of posts) {
            const getSignedUrlCommand = new GetObjectCommand({
                Bucket: bucketName,
                Key: post.imageName,
            });

            const imageUrl = await getSignedUrl(s3, getSignedUrlCommand, { expiresIn: 3600 });

            modifiedPosts.push({
                ...post,
                imageUrl,
            });
        }

        res.status(200).json({
            status: "success",
            message: "Successfully fetched posts",
            posts: modifiedPosts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: "Something went wrong while fetching posts",
            posts: null,
        });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const bucketName = process.env.BUCKET_NAME;

        const id = parseInt(req.params.id);
        const post = await prisma.posts.findUnique({ where: { id } });

        if (!post) {
            return res.status(404).json({
                status: "failed",
                message: "Post not found",
            });
        }

        const deleteObjectCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: post.imageName,
        });

        await s3.send(deleteObjectCommand);

        await prisma.posts.delete({ where: { id } });

        res.status(200).json({
            status: "success",
            message: "Successfully deleted this post",
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Something went wrong while deleting this post",
        });
    }
};
