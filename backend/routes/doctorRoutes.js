
import express from 'express';
import getDoctors from '../controller/doctorController.js';
import doctorLogin from '../controller/doctorLoginController.js';
import { getDoctor } from '../controller/doctorLoginController.js';


const expressRouter = express.Router();

expressRouter.get('/list', getDoctors);
expressRouter.post('/doctor/login', doctorLogin);
expressRouter.get('/doctor/:id', getDoctor);

export default expressRouter;