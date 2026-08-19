import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import dns from "node:dns/promises";
// set dns
if (process.env.NODE_ENV !== "production") {
    dns.setServers(["1.1.1.1"]);
}
import connetDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';
import { validate } from './validate/JsonToken.js';
import patientRouter from './routes/patientRouter.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import { initiSocket } from './socket/socket.js';
import session from "express-session";
import passport from "passport";

//app config
const app = express();
const server = createServer(app);
const port = process.env.PORT || 4000;
connetDB();
connectCloudinary();

//socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

//connect socket
initiSocket(io);

//middleware
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "https://doctor-metix.netlify.app"],
    credentials: true
}));
app.use(cookieParser("metix"));
app.set("trust proxy", 1);
app.use(session({
    secret: process.env.SESSION_SECRET || "metixcentersecret",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: true,
        sameSite: "none",
    },
}));
app.use(passport.initialize());
app.use(passport.session());

//API Endpoint
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/patient', patientRouter);



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

server.listen(port, () => console.log(`listening on port ${port}`));

// app.listen(port, "0.0.0.0", () => console.log(`listening on port ${port}`));