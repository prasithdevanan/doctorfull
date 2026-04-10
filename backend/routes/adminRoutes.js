import express from 'express';
import { addDoctor, adminLogin} from '../controller/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import doctorDelete from '../controller/doctorDeleteController.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor);
adminRouter.post('/login',adminLogin);
adminRouter.delete('/delete-doctor/:id', doctorDelete);


export default adminRouter;