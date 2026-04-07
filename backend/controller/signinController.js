import signinModel from "../models/signinModel.js";
import validator from "validator";
import bycrypt from "bcrypt";


const Signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Missing data" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter Vaild Email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter strong password" });
        }

        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        const user = new signinModel({ email, password: hashedPassword });
        await user.save();
        res.json({ success: true, message: "User registered successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
        console.log(error);
    }           
        }

export default Signin;