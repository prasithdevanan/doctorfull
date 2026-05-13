import express from 'express';
import { addDoctor, adminLogin} from '../controller/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import doctorDelete from '../controller/doctorDeleteController.js';
import { getLogo, getLogoImage } from '../controller/logoController.js';
import { getAppointments } from '../controller/appointmentSlot.js';
import { order, verify} from '../controller/payment.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor);
adminRouter.post('/login',adminLogin);
adminRouter.delete('/delete-doctor/:id', doctorDelete);
adminRouter.post('/custom',authAdmin,upload.single('image'),getLogo);
adminRouter.get('/logo',getLogoImage);
adminRouter.get('/appointment', getAppointments);
adminRouter.post('/order',order);
adminRouter.post('/order/verify',verify);




export default adminRouter;