import express from 'express';
import Signin from '../controller/signinController.js';
import Login from '../controller/loginController.js';
import LoginId from '../controller/loginIdController.js';
import PatientList from '../controller/paitentListController.js';
import getAppointments from '../controller/appointmentController.js';
import { patientUpdate } from '../controller/paitentListController.js';
import upload from '../middlewares/multer.js';
import getDoctorAppointments, { getPatientAppointments } from '../controller/appointmentSlot.js';


const patientRouter = express.Router();


patientRouter.post('/signin', Signin);
patientRouter.post('/login', Login);
patientRouter.get('/signin/:id', LoginId);
patientRouter.get('/list', PatientList);
patientRouter.post('/appointment', getAppointments);
patientRouter.put('/update/:id', upload.single('image'), patientUpdate);
patientRouter.get('/appointment/timeslot', getDoctorAppointments);
patientRouter.get('/appointment/patient', getPatientAppointments);

export default patientRouter;