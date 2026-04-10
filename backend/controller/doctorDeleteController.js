import doctorModel from "../models/doctorModel.js";

const doctorDelete = async (req, res) => {
    try {
        const userId = req.params.id;
        // Check user exists
        const user = await doctorModel.findById(userId);
        if (!user) {
            res.status(400).json({ success: false, message: "User not found" });
        }
        await doctorModel.findByIdAndDelete(userId);
        res.json({ success: true, message: "Doctor deleted successfully" });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export default doctorDelete;