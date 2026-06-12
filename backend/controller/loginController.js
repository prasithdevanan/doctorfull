import signinModel from "../models/signinModel.js";
import bycrypt from "bcrypt";

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check user exists
        const user = await signinModel.findOne({ email });

        if (!user) {
            res.status(400).json({ success: false, message: "User not found" });
        }
        // Compare password
        const isMatch = await bycrypt.compare(password, user.password);

        if (!isMatch) {
           return res.status(400).json({ success: false, message: "Invaild Credentials" });
        }
        // Success
        res.json({
            success: true, message: "User logged in successfully", user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
       return res.status(500).json({ success: false, message: error.message || "Server Error" });
        
    }
}


export default Login;