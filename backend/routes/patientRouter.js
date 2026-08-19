import express from 'express';
import Signin from '../controller/signinController.js';
import Login from '../controller/loginController.js';
import LoginId from '../controller/loginIdController.js';
import PatientList from '../controller/paitentListController.js';
import getAppointments from '../controller/appointmentController.js';
import { patientUpdate } from '../controller/paitentListController.js';
import upload from '../middlewares/multer.js';
import getDoctorAppointments, { getPatientAppointments, deleteAppointments } from '../controller/appointmentSlot.js';
import { updateSchedule } from '../controller/appointmentUpdate.js';
import passport from '../controller/googleLogin.js';
import jwt from 'jsonwebtoken';
import signinModel from '../models/signinModel.js';



const patientRouter = express.Router();
const frontendUrl = process.env.FRONTEND_URL;

patientRouter.post('/signin', Signin);
patientRouter.post('/login', Login);
patientRouter.get('/signin/:id', LoginId);
patientRouter.get('/list', PatientList);
patientRouter.post('/appointment', getAppointments);
patientRouter.put('/update/:id', upload.single('image'), patientUpdate);
patientRouter.get('/appointment/timeslot', getDoctorAppointments);
patientRouter.get('/appointment/patient', getPatientAppointments);
patientRouter.patch('/appointment/reschedule/:id', updateSchedule);
patientRouter.delete('/appointment/delete/:id', deleteAppointments);
patientRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
patientRouter.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${frontendUrl}/login?googleError=1`,
    }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.redirect(`${frontendUrl}/googleSuccess?token=${token}`);

    }
);

// Auth middleware
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    try {
        const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

patientRouter.get("/auth/me", requireAuth, async(req, res) => {
    const user = await signinModel.findById(req.userId);
    if (!user) return res.status(401).json({ success: false, message: "Not authenticated" });
    return res.json({
        success: true,
        user: {
            id: user._id,
            email: user.email,
            name: user.username,
            profileImage: user.image,
            patientId: user.patientId,
        },
    });
});
export default patientRouter;