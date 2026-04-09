import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connetDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';
import { validate } from './validate/JsonToken.js';
import patientRouter from './routes/patientRouter.js';

//app config
const app = express();
const port = process.env.PORT || 4000;
connetDB();
connectCloudinary();

//middleware
app.use(express.json());
app.use(cors());

//API Endpoint
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/patient', patientRouter);


//Endpoints

//**Post****/api/doctor/signin ----------check the signIn*/
//**Post*** /api/doctor/login ----------check the login*/
//**Get*** /api/list -------------------Get the doctors List*/

// routes
app.post('/api/validation', validate); 

app.get('/', (req, res) => {
    res.status(200).send('Hello Worldnnnnnnnn!'); 
});

app.get("/home", (req, res) => {
    res.status(404).send("this screen not define")
})


app.listen(port, () => console.log(`listening on port ${port}`));