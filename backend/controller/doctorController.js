import doctorModel from "../models/doctorModel.js";

const getDoctors = async (req, res) => {

    try {
        const { search } = req.query;
        let filter = {};
        if (search) {
            filter = {
                $or:  [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            }
        }
        console.log(search)
        const doctorsList = await doctorModel.find(filter);
        res.status(200).json({ success: true, doctorsList });

    } catch (error) {
        res.status(500).json({ success: false, message: error });

    }
}

export default getDoctors;