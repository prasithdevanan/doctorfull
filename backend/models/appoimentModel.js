import mongoose, { Schema } from "mongoose";


const appointmentSchema = new mongoose.Schema({
    patientName: { type: String },
    patientEmail: { type: String },
    patientPhone: { type: String },
    doctorId: { type: String },
    doctorName: { type: String },
    doctorEmail: { type: String },
    doctorSpeciality: { type: String },
    appointmentDate: { type: String },
    appointmentTime: { type: String },
    reason: { type: String },
    status: { type: String, default: "pending" },
    paymentStatus: { type: String, default: "unpaid" },
    paymentId: { type: String },
    fees: { type: Number },
}, { minimize: false, timestamps: true });

appointmentSchema.index(
    { doctorId: 1, appointmentDate: 1, appointmentTime: 1 },
    { unique: true }
);

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);


export default appointmentModel;