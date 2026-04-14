import appointmentModel from "../models/appoimentModel.js";


const getAppointments = async (req, res) => {
    try {
        const {patientName, patientEmail, patientPhone, doctorName, doctorEmail, doctorSpeciality, appointmentDate, appointmentTime, reason, status, paymentStatus, paymentId, fees, doctorId} = req.body;

        if (!patientName || !patientEmail || !patientPhone || !doctorName || !doctorEmail || !doctorSpeciality || !appointmentDate || !appointmentTime || !reason || !status || !paymentStatus || !paymentId || !fees) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const appointment = {
            patientName,
            patientEmail,
            patientPhone,
            doctorName,
            doctorEmail,
            doctorId,
            doctorSpeciality,
            appointmentDate,
            appointmentTime,
            reason,
            status,
            paymentStatus,
            paymentId,
            fees
        }
        
        const newAppointment = new appointmentModel(appointment);
        await newAppointment.save();
        res.status(201).json({ success: true, message: "Appointment created successfully", newAppointment, appointmentId: newAppointment._id });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export default getAppointments;