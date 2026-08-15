import { v2 as cloudinary } from 'cloudinary';

// Configure the Cloudinary instance
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a base64 or file path buffer to Cloudinary.
 * We will use this in our Server Actions for the Media Library.
 */
export async function uploadToCloudinary(
  fileStr: string,
  folder: string = 'nova_industries/media'
) {
  try {
    const result = await cloudinary.uploader.upload(fileStr, {
      folder: folder,
      resource_type: 'auto', // Automatically detects image, video, or raw file (PDFs)
    });
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload media to Cloudinary');
  }
}

/**
 * Deletes a file from Cloudinary (used when an Admin archives/deletes media)
 */
export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete media from Cloudinary');
  }
}

export default cloudinary;