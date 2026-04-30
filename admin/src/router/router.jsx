import React, { useEffect } from 'react';
import { createBrowserRouter, useNavigate, Navigate } from 'react-router-dom';
import App from '../App';
import Dashboard from '../Pages/Admin/Dashboard';
import Login from '../Pages/login/Login';
import ProductorRouter from './ProductorRouter';
import Appoiment from '../Pages/Admin/Appoinment/Appoiment';
import AddDoctor from '../Pages/Admin/AddDoctor';
import DoctorList from '../Pages/Admin/DoctorList';
import axios from 'axios';
import Custom from '../Pages/Admin/Custom';
import AppoitmentDetails from '../Pages/Admin/Appoinment/AppoitmentDetails';


//get Token from the Localstorage
const token = localStorage.getItem('aToken') || localStorage.getItem('dToken');


export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <ProductorRouter><Dashboard /></ProductorRouter>
            },
            {
                path: 'login',
                element: token ? <Navigate to='/' replace /> : <Login />
            },
            {
                path: 'appoinment',
                element: <ProductorRouter><Appoiment /></ProductorRouter>
            },
            {
                path: 'appoinment/details',
                element: <ProductorRouter><AppoitmentDetails /></ProductorRouter>
            },
            {
                path: 'add-doctor',
                element: <ProductorRouter adminOnly={true}><AddDoctor /></ProductorRouter>
            },
            {
                path: 'doctorList',
                element: <ProductorRouter><DoctorList /></ProductorRouter>
            },
            {
                path: 'custom',
                element: <ProductorRouter><Custom /></ProductorRouter>
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/login" />
    }
])