import doctorModel from "../models/doctorModel.js";

const getDoctors = async (req, res) => {
    console.log(req.url);
    try {
        const doctorsList = await doctorModel.find();
        res.status(200).json({ success: true, doctorsList });
        console.log(doctorsList);

    } catch (error) {
        res.status(500).json({ success: false, message: error });
        console.log(error.message);
    }
}

export default getDoctors;