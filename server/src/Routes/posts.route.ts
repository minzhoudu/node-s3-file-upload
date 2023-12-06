import { Router } from "express";
import * as multer from "multer";

import { getPosts, newPost } from "../Controllers/posts.controller";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
});

router.get("/posts", getPosts);
router.post("/posts", upload.single("image"), newPost);

export default router;
