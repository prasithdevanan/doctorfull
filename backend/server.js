import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connetDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';
import { validate } from './validate/JsonToken.js';
import patientRouter from './routes/patientRouter.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

//app config
const app = express();
const server = createServer(app);
const io = new Server(server);
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

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


//Endpoints

//**Post****/api/doctor/signin ----------check the signIn*/
//**Post*** /api/doctor/login ----------check the login*/
//**Get*** /api/doctor/list ------------Get the doctors List*/

// routes
app.post('/api/validation', validate);

app.get('/', (req, res) => {
    res.status(200).send('Hello Worldnnnnnnnn!');
});

app.get("/home", (req, res) => {
    res.status(200).send("This is the home page");
})


app.listen(port, () => console.log(`listening on port ${port}`));