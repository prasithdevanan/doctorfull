import Login from '../controller/loginController.js';
import Signin from '../controller/signinController.js';
import express from 'express';
import LoginId from '../controller/loginIdController.js';
import getDoctors from '../controller/doctorController.js';
import doctorLogin from '../controller/doctorLoginController.js';


const expressRouter = express.Router();

expressRouter.post('/signin', Signin);
expressRouter.post('/login', Login);
expressRouter.get('/signin/:id', LoginId);
expressRouter.get('/list', getDoctors);
expressRouter.post('/doctor/login', doctorLogin);

export default expressRouter;