import appointmentModel from "../models/appoimentModel.js";

const getDoctorAppointments = async (req, res) => {


    try {
        const { doctorId, appointmentDate } = req.query;
        const appointments = await appointmentModel.find({ doctorId, appointmentDate });

        if (!appointments) {
            return res.json({ success: false, message: "No appointments found" });
        }

        const bookedSlots = appointments.map(appointment => appointment.appointmentTime);
        res.json({ success: true, bookedSlots });



    } catch (error) {
        res.json({ success: false, message: error })

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

    }
}


export const getAppointments = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = "", doctorEmail } = req.query;
        const query = {};

        if (doctorEmail) {
            query.doctorEmail = doctorEmail;
        }

        if (search) {
            query.doctorName = { $regex: search, $options: "i" };
        }

        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 9;

        const skip = (pageNumber - 1) * limitNumber;
        const appointments = await appointmentModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
        const totalAppointments = await appointmentModel.countDocuments(query);

        if (!appointments) {
            return res.json({ success: false, message: "No appointments found" });
        }
        res.json({ success: true, appointments, totalAppointments, page: Number(page), totalPages: Math.ceil(totalAppointments / limitNumber) });

    }
    catch (error) {
        res.json({ success: false, message: error })

    }
}


export default getDoctorAppointments;