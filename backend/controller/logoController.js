import logoModel from "../models/logoModel.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const getLogo = async (req, res) => {
    try {
        const { name } = req.body;
        const { logo } = req.file;
        if (!logo || !name) {
            return res.json({ success: false, message: "Missing data" });
        }

        const imageUpload = await uploadToCloudinary(image);
        const imageUrl = imageUpload.secure_url;

        const logoDate = new logoModel({ logo : imageUrl, name });
        await logoDate.save();
        res.json({ success: true, message: "Logo uploaded successfully" });

    } catch (error) {
        res.json({ success: false, message: error });
    }
}