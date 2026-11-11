import { Readable } from "node:stream";
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
): Promise<{
  url: string;
  image_id: string;
}> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload error"));
          return;
        }

        resolve({
          url: result.secure_url,
          image_id: result.public_id,
        });
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};
