import appointmentModel from "../models/appoimentModel.js";

const getDoctorAppointments = async (req, res) => {
    
    
    try {
        const { doctorId, appointmentDate } = req.query;
        const appointments =await appointmentModel.find({ doctorId, appointmentDate });

        if (!appointments) {
            return res.json({ success: false, message: "No appointments found" });
        }

        const bookedSlots = appointments.map(appointment => appointment.appointmentTime);
        res.json({ success: true, bookedSlots });
      

        
    } catch (error) {
        res.json({ success: false, message: error })
        console.log(error);
    }
}



export const getPatientAppointments = async (req, res) => {
    try {
        const { patientEmail } = req.query;
        const appointments = await appointmentModel.find({ patientEmail });

        if (!appointments) {
            return res.json({ success: false, message: "No appointments found" });
        }
        res.json({ success: true, appointments });
        
    } catch (error) {
        res.json({ success: false, message: error })
        console.log(error);
    }
}


export default getDoctorAppointments;