import mongoose from "mongoose";

const signinSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    gender: { type: String, default: "Not Selectes" },
    DOB: { type: String, default: "Not Selectes" },
    phone: { type: String, default: "" },
    patientId: { type: String, unique: true, required: true },
}, { timestamps: true });

const signinModel = mongoose.models.patients || mongoose.model('patients', signinSchema);

export default signinModel;