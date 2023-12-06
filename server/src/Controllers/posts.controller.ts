import { Request, Response } from "express";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { prisma, s3 } from "../server";
import { generateImageName, resizeImage } from "./../Services/images.service";

export const newPost = async (req: Request, res: Response) => {
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
        });
    }
};

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.posts.findMany();
        const modifiedPosts = [];
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
        res.status(500).json({
            status: "failed",
            message: "Something went wrong while fetching posts",
        });
    }
};
