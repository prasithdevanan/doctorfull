import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt';
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { cloudinary } from "../config/cloudinary.js";


const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}
const doctorLogin = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    try {
        const doctor = await doctorModel.findOne({ email });
        if (!doctor) {
            return res.status(400).json({ success: false, message: "Doctor not found" });
        }
        const isMatch = await comparePassword(password, doctor?.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Password" });
        }
        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({
            success: true,
            message: "Doctor logged in successfully",
            token,
            doctor
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}



/// get doctor by email id

export const getDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await doctorModel.findById(id);
        if (!doctor) {
            return res.status(400).json({ success: false, message: "Doctor not found" });
        }
        return res.json({ success: true, doctor });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getDoctorByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const doctor = await doctorModel.findOne({ email });
        if (!doctor) {
            return res.status(400).json({ success: false, message: "Doctor not found" });
        }
        return res.json({ success: true, doctor });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateDoctor = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            mobile
        } = req.body;

        const image = req.file;

        // Find existing doctor
        const doctor = await doctorModel.findById(id);

        if (!doctor) {
            return res.status(400).json({
                success: false,
                message: "Doctor not found"
            });
        }

        // Default old image
        let imageUrl = doctor.image;
        
        // If new image uploaded
        if (image) {

            // DELETE OLD CLOUDINARY IMAGE
            if (doctor.imagePublicId) {
                await cloudinary.uploader.destroy(
                    doctor.imagePublicId
                );
            }

            // Upload new image
            const imageUpload = await uploadToCloudinary(image);

            imageUrl = imageUpload.secure_url;

            // Save public_id for future delete/update
            doctor.imagePublicId = imageUpload.public_id;
        }

        // Update fields
        doctor.name = name || doctor.name;
        doctor.email = email || doctor.email;
        doctor.password = password || doctor.password;
        doctor.speciality = speciality || doctor.speciality;
        doctor.degree = degree || doctor.degree;
        doctor.experience = experience || doctor.experience;
        doctor.about = about || doctor.about;
        doctor.fees = fees || doctor.fees;
        doctor.address = address || doctor.address;
        doctor.mobile = mobile || doctor.mobile;

        // Update image
        doctor.image = imageUrl;

        await doctor.save();

        return res.json({
            success: true,
            doctor,
            message: "Doctor updated successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default doctorLogin;