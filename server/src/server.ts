import { S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import * as cors from "cors";
import "dotenv/config";
import * as express from "express";

import postsRouter from "./Routes/posts.route";

const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

export const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey,
    },
    region: bucketRegion,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

export const prisma = new PrismaClient();

app.use("/api", postsRouter);

app.listen(3000, () => {
    console.log("Server is running at port 3000");
});
