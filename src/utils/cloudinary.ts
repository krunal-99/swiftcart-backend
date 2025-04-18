import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const deleteCloudinaryImage = async (imageUrl: string) => {
  try {
    if (!imageUrl || !imageUrl.includes("cloudinary")) return;

    const urlParts = imageUrl.split("/");
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const folderName = urlParts[urlParts.length - 2];
    const publicId = `${folderName}/${publicIdWithExtension.split(".")[0]}`;

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

export const uploadToCloudinary = async (base64Image: string) => {
  try {
    const base64Data = base64Image.includes("data:image")
      ? base64Image
      : `data:image/jpeg;base64,${base64Image}`;

    const result = await cloudinary.uploader.upload(base64Data, {
      folder: "ecommerce-user-profiles",
      resource_type: "auto",
      allowed_formats: ["jpg", "jpeg", "png", "gif"],
      transformation: [
        { width: 400, height: 400, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
      eager: [{ width: 100, height: 100, crop: "thumb", gravity: "face" }],
      eager_async: true,
      use_filename: false,
      unique_filename: true,
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};
