import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadFile(
  file: Buffer,
  folder: string,
  resourceType: "video" | "raw" | "image" = "raw"
) {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: resourceType }, (err, result) => {
        if (err || !result) return reject(err)
        resolve({ url: result.secure_url, publicId: result.public_id })
      })
      .end(file)
  })
}

export async function deleteFile(publicId: string, resourceType: "video" | "raw" | "image" = "raw") {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}
