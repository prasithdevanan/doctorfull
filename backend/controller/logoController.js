import logoModel from "../models/logoModel.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const getLogo = async (req, res) => {
    try {
        const { companyName } = req.body;
        const image = req.file;
        console.log(companyName, image);
        if (!image || !companyName) {
            return res.json({ success: false, message: "Missing data" });
        }

        const imageUpload = await uploadToCloudinary(image);
        const imageUrl = imageUpload.secure_url;

        const logoDate = await logoModel.findOneAndUpdate({}, { name: companyName, image: imageUrl }, { upsert: true, returnDocument: 'after' });
        res.json({ success: true, message: "Logo uploaded successfully" });

    } catch (error) {
        res.json({ success: false, message: error });
    }
};


export const getLogoImage = async (req, res) => {
    try {
        const logo = await logoModel.findOne({key: "main"});
        if (!logo) {
            return res.json({ success: false, message: "No logo found" });
        }
        res.json({ success: true, logo });
        
    } catch (error) {
        res.json({ success: false, message: error });
    }
}