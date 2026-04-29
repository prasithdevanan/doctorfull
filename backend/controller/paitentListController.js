import signinModel from "../models/signinModel.js";
import { v2 as cloudinary } from 'cloudinary';
import { uploadToCloudinary } from "../utils/cloudinary.js";

const PatientList = async (req, res) => {
    try {
        const patientsList = await signinModel.find();
        if (!patientsList) {
            return res.status(400).json({ success: false, message: "No patients found" });
        }
        res.json({ success: true, message: "Patients list fetched successfully", patientsList });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const patientUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { DOB, phone, gender } = req.body;
        const image = req.file ? req.file : undefined;

        ///image upload to cloudinary
        if (image) {
            //upload image to cloudinary if image file is provided
            // const imageUpload = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
            const imageUpload = await uploadToCloudinary(image);
            const imageUrl = imageUpload.secure_url;


            const updatedPatient = await signinModel.findByIdAndUpdate(id, { image: imageUrl }, { returnDocument: 'after' });

            if (!updatedPatient) {
                return res.status(404).json({ success: false, message: "Patient not found" });
            }
        }

        /// update other details
        const updatedPatient = await signinModel.findByIdAndUpdate(id, { DOB, phone, gender }, { returnDocument: 'after' });
        if (!updatedPatient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        /// send response for successful update
        res.json({ success: true, message: "Patient updated successfully", updatedPatient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export default PatientList;