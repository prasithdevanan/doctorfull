import mongoose from "mongoose";


const appointmentSchema = new mongoose.Schema({
    patientName: { type: String },
    patientEmail: { type: String },
    patientPhone: { type: String },
    patientId: { type: String },
    doctorId: { type: String },
    doctorName: { type: String },
    doctorEmail: { type: String },
    doctorSpeciality: { type: String },
    image: { type: String, default: 'https://res.cloudinary.com/dxw2bf8ns/image/upload/v1776318986/default_img_fzahth.png' },
    appointmentDate: { type: String },
    appointmentTime: { type: String },
    reason: { type: String },
    status: { type: String, default: "Pending" },
    paymentStatus: { type: String, default: "Unpaid" },
    paymentId: { type: String },
    fees: { type: Number },
}, { minimize: false, timestamps: true });

appointmentSchema.index(
  {
    doctorId: 1,
    appointmentDate: 1,
    appointmentTime: 1
  },
  {
    unique: true,
    partialFilterExpression: {
      appointmentDate: { $exists: true, $ne: null },
      appointmentTime: { $exists: true, $ne: null }
    }
  }
);
appointmentSchema.index({ doctorEmail: 1, createdAt: -1 });



const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);


export default appointmentModel;