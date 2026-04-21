import mongoose from "mongoose";

const patientIdSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, default: 0 }
});

const patiendIdModel = mongoose.model("patientId", patientIdSchema);


export default patiendIdModel;