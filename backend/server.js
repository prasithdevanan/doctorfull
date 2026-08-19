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
import MongoStore from "connect-mongo";

//app config
const app = express();
const isProd = process.env.NODE_ENV === "production";
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

// --- CORS ---
const allowedOrigins = [
    "http://localhost:5173",
    "https://doctor-metix.netlify.app",
    "https://doctor-metix-admin.netlify.app"
];
//middleware
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        // allow non-browser requests (curl, server-to-server) with no origin
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
}));
app.use(cookieParser("metix"));
app.set("trust proxy", 1);
app.use(session({
    name: "doctorfull.sid",
    secret: process.env.SESSION_SECRET || "metixcentersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
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