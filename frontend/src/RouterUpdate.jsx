import { createBrowserRouter, createHashRouter } from "react-router-dom";
import { useContext } from "react";
import App from "./App";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Doctor from "./pages/Doctor";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import { Navigate } from "react-router-dom";
import DoctorBooking from "./pages/DoctorBooking";
import Payment from "./pages/Payment";
import Login from "./pages/Login/Sign/Login";
import Signin from "./pages/Login/Sign/Signin";
import PubilcRouter from "./Production/CheckLogin/PubilcRouter";
import PatientDetails from "./pages/PatientDetails";
import Appointment from "./pages/Appointment";
import Reschedule from "./pages/Reschedule";
import PaymentSuccess from "./pages/PaymentStatus";


export const router = createBrowserRouter ([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: '/login',
                element: <PubilcRouter><Login /></PubilcRouter>
            },
            {
                path: '/signin',
                element: <PubilcRouter><Signin /></PubilcRouter>
            },
            {
                path: "/home",
                element: <Navigate to="/" replace />,
            },
            {
                path: "/doctor",
                element: <Doctor />,
            },
            {
                path: "/doctor/:id/patientdetails",
                element: <PatientDetails />,
            },
            {
                path: "doctor/:id",
                element: <DoctorBooking />,
            },
            {
                path: "/doctor/:id/patientdetails/payment",
                element: <Payment />,
            },
            {
                path: "/doctor/:id/patientdetails/payment/success",
                element: <PaymentSuccess />,
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/contact",
                element: <Contact />,
            },
            {
                path: "/profile",
                element: <Profile />,
            },
            {
                path: "/appointment",
                element: <Appointment />,
            },
            {
                path:"/appointment/:id/reschedule",
                element: <Reschedule />,
            }
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    }
]
);
