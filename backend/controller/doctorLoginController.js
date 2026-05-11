import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt';


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

export default doctorLogin;