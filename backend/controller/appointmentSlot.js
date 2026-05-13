import appointmentModel from "../models/appoimentModel.js";
import NotificationModel from "../models/notificationModel.js";

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
            query.$or = [
                { patientName: { $regex: search, $options: "i" } },
                { patientEmail: { $regex: search, $options: "i" } },
            ]
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


////delete the appointment slot
export const deleteAppointments = async (req, res) => {

    try {
        const { id } = req.params;
        const appointment = await appointmentModel.findByIdAndDelete(id);

        if (!appointment) {
            res.status(404).json({ success: false, message: "Appointment not found" });
        }

        res.json({ success: true, message: "Appointment deleted successfully", appointment });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export default getDoctorAppointments;