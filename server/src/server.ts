import * as express from "express";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import * as cors from "cors";
import * as multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
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

const prisma = new PrismaClient();

const storage = multer.memoryStorage();

const upload = multer({
    storage,
});

app.get("/api/posts", async (req, res) => {
    const posts = await prisma.posts.findMany();
    res.send(posts);
});

app.post("/api/posts", upload.single("image"), async (req, res) => {
    const params = {
        Bucket: bucketName,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    res.send({});
});

app.listen(3000, () => {
    console.log("Server is running at port 3000");
});
