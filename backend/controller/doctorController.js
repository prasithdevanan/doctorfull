import doctorModel from "../models/doctorModel.js";

const getDoctors = async (req, res) => {

    try {
        const doctorsList = await doctorModel.find();
        res.status(200).json({ success: true, doctorsList });

    } catch (error) {
        res.status(500).json({ success: false, message: error });
     
    }
}

export default getDoctors;