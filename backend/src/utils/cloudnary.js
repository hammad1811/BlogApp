import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:  process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


export const uploadOnCloudnary = async (filePath) => {
    try {
        if (!filePath) return null;
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
        });
        fs.unlinkSync(filePath)
        return result;
    } catch (error) {
        fs.unlinkSync(filePath)
        throw new Error('Error uploading file to Cloudinary');
    }
   
}