import express from 'express';
import Signin from '../controller/signinController.js';
import Login from '../controller/loginController.js';
import LoginId from '../controller/loginIdController.js';
import PatientList from '../controller/paitentListController.js';


const patientRouter = express.Router();


patientRouter.post('/signin', Signin);
patientRouter.post('/login', Login);
patientRouter.get('/signin/:id', LoginId);
patientRouter.get('/list', PatientList);

export default patientRouter;