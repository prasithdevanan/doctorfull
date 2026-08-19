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
    (req, res, next) => {
        console.log("Google authenticated:", req.isAuthenticated());
        console.log("User:", req.user);
        console.log("Session ID:", req.sessionID);
        console.log("Session:", req.session);

        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return next(err);
            }

            console.log("Session saved:", req.sessionID);

            res.redirect(`${frontendUrl}/googleSuccess`);
        });
    }
);
patientRouter.get("/auth/me", (req, res) => {
    console.log("========== AUTH ME ==========");
    console.log("isAuthenticated:", req.isAuthenticated());
    console.log("user:", req.user);
    console.log("sessionID:", req.sessionID);
    console.log("session:", req.session);
    console.log("cookie:", req.headers.cookie);
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated",
        });
    }

    return res.json({
        success: true,
        user: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.username,
            profileImage: req.user.image,
            patientId: req.user.patientId,
        },
    });
});
export default patientRouter;