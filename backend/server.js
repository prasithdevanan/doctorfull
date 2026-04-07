import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connetDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';

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


// routes


app.get('/', (req, res) => {
    res.status(200).send('Hello Worldnnnnnnnn!'); 
});

app.get("/home", (req, res) => {
    res.status(404).send("this screen not define")
})


app.listen(port, () => console.log(`listening on port ${port}`));