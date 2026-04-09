
import express from 'express';
import getDoctors from '../controller/doctorController.js';
import doctorLogin from '../controller/doctorLoginController.js';


const expressRouter = express.Router();

expressRouter.get('/list', getDoctors);
expressRouter.post('/doctor/login', doctorLogin);

export default expressRouter;