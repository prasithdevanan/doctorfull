import appointmentModel from "../models/appoimentModel";

export const updateSchedule = async (req, res) => {
    try {
        const { doctorId, appointmentDate, appointmentTime, status } = req.body;

        const appointment = await appointmentModel.findOneAndUpdate(
            { doctorId, appointmentDate, appointmentTime },
            { status },
            { returnDocument: 'after' }
        );

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        res.json({ success: true, message: "Appointment updated successfully", appointment });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}