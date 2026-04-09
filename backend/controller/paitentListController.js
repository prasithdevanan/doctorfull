import signinModel from "../models/signinModel.js";

const PatientList = async (req, res) => {
    try {
        const patientsList = await signinModel.find();
        if (!patientsList) {
            return res.status(400).json({ success: false, message: "No patients found" });
        }
        res.json({ success: true, message: "Patients list fetched successfully", patientsList });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export default PatientList;