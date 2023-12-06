import * as crypto from "crypto";
import * as sharp from "sharp";

export const generateImageName = (originalName, bytes = 32) => {
    const randomBytes = crypto.randomBytes(bytes).toString("hex");

    return `${originalName}-${randomBytes}`;
};

export const resizeImage = async (buffer: Buffer, height: number, width: number): Promise<Buffer> => {
    return await sharp(buffer)
        .resize({
            height,
            width,
            fit: "contain",
        })
        .toBuffer();
};
