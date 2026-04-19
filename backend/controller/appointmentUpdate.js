import appointmentModel from "../models/appoimentModel.js";

export const updateSchedule = async (req, res) => {
    console.log("Received reschedule request:", req.body);
    try {
        const { id } = req.params;
        const { doctorId, appointmentDate, appointmentTime, status } = req.body;
      
        const appointment = await appointmentModel.findByIdAndUpdate(id,
            { doctorId, appointmentDate, appointmentTime, status },
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