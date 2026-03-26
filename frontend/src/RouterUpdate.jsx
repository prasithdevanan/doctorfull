import { createBrowserRouter } from "react-router-dom";
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

export const router = createBrowserRouter([
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
                element: <Login />
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
                path: "doctor/:id",
                element: <DoctorBooking />,
            },
            {
                path: "doctor/:id/payment",
                element: <Payment />,
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
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    }
]);
