import appointmentModel from "../models/appoimentModel.js";

const getDoctorAppointments = async (req, res) => {
    console.log(req.query, "ppppppppppppppp");
    try {
        const { doctorId, appointmentDate } = req.query;
        const appointments =await appointmentModel.find({ doctorId, appointmentDate });
        console.log(appointments);

        const bookedSlots = appointments.map(appointment => appointment.appointmentTime);
        console.log(bookedSlots);
        res.json({ success: true, bookedSlots });

        
    } catch (error) {
        res.json({ success: false, message: error })
        console.log(error);
    }
}


export default getDoctorAppointments;