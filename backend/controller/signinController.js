import signinModel from "../models/signinModel.js";
import validator from "validator";
import bycrypt from "bcrypt";
import patiendIdModel from "../models/patientId.js";


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

        const exsistUser = await signinModel.findOne({ email });
        if (exsistUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        const counter = await patiendIdModel.findOneAndUpdate({ name: "patient" }, { $inc: { value: 1 } }, { upsert: true, returnDocument: 'after' });
        const patientId = `PAT${String(counter.value).padStart(6, '0')}`;

        const user = new signinModel({ email, password: hashedPassword, patientId });
        await user.save();
        res.json({ success: true, message: "User registered successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
      
    }
}

export default Signin;