
import express from 'express';
import getDoctors from '../controller/doctorController.js';
import doctorLogin from '../controller/doctorLoginController.js';
import { getDoctor } from '../controller/doctorLoginController.js';
import { getDoctorByEmail, updateDoctor } from '../controller/doctorLoginController.js';
import upload from '../middlewares/multer.js';


const expressRouter = express.Router();

expressRouter.get('/list', getDoctors);
expressRouter.post('/doctor/login', doctorLogin);
expressRouter.get('/doctor/:id', getDoctor);
expressRouter.get('/doctor/email/:email', getDoctorByEmail);
expressRouter.post('/doctor/profile/update/:id', upload.single('profileImage'), updateDoctor);

export default expressRouter;