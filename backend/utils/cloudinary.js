import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';


export const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);

        uploadStream.on(
            'error',
            (error) => {
                reject(error);
            }
        )
    })
}