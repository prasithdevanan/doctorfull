import Login from '../controller/loginController.js';
import Signin from '../controller/signinController.js';
import express from 'express';
import LoginId from '../controller/loginIdController.js';


const expressRouter = express.Router();

expressRouter.post('/signin', Signin);
expressRouter.post('/login', Login);
expressRouter.get('/signin/:id', LoginId);

export default expressRouter;