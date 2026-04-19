import express from 'express';
import { addDoctor, adminLogin} from '../controller/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import doctorDelete from '../controller/doctorDeleteController.js';
import { getLogo } from '../controller/logoController.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor);
adminRouter.post('/login',adminLogin);
adminRouter.delete('/delete-doctor/:id', doctorDelete);
// adminRouter.post('/custom',authAdmin,upload.single('logo'),getLogo);


export default adminRouter;