import signinModel from "../models/signinModel.js";


const LoginId = async (req, res) => {
    try {
        const userId = req.params.id;
        // Check user exists
        const user = await signinModel.findById(userId);
        if (!user) {
            res.status(400).json({ success: false, message: "User not found" });
        }
        res.json({
            success: true, message: "User logged in successfully", user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
        console.log(error);
    }
}

export default LoginId;