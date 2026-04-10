import validator from 'validator';
import bycrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken'

//API for the add doctor for the admin


const addDoctor = async (req, res) => {
    const allowTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;
        if (!imageFile) {
            console.log("image file missing");
            return res.json({ success: false, message: "Missing data" })
        }

        //check the image format
        if (!allowTypes.includes(imageFile.mimetype)) {
            return res.json({ success: false, message: "Invalid image format only jpg, png, jpeg" })
        }

        //check the all file data doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing data" })
        }

        //check email vailtator
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter Vaild Email" })
        }

        //check strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter strong password" })
        }

        // hashing passsword

        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);


        // upload image to cloudinary
         const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
        const imageUrl = imageUpload.secure_url;


        // final doctor data
        const doctorDate = {
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            image: imageUrl,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorDate)
        await newDoctor.save()

        res.json({ success: true, message: "Doctor Added" })

    } catch (error) {
        res.json({ success: false, message: error })
        console.log(error);
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invaild Credentials" });
        }
    } catch (error) {
        res.json({ success: false, message: error })
        console.log(error);
    }
}

export { addDoctor, adminLogin }