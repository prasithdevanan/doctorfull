import mongoose from "mongoose";

const signinSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    gender: { type: String, default: "Not Selectes" },
    DOB: { type: String, default: "Not Selectes" },
    phone: { type: String, default: "" },
    patientId: { type: String, unique: true, required: true },
}, { timestamps: true });

const signinModel = mongoose.models.patients || mongoose.model('patients', signinSchema);

export default signinModel;