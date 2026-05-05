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
import PublicRoute from './PublicRoute';
import Profile from '../Pages/profile/Profile';
import PatientList from '../Pages/Admin/Patient/PatientList';
import PatientDetails from '../Pages/Admin/Patient/PatientDetails';

//get Token from the Localstorage
const token = localStorage.getItem('aToken') || localStorage.getItem('dToken');


export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [

            {
                index: true,
                element: (
                    <ProductorRouter>
                        <Dashboard />
                    </ProductorRouter>
                )
            },

            {
                path: 'login',
                element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                )
            },

            {
                path: 'appoinment',
                element: (
                    <ProductorRouter>
                        <Appoiment />
                    </ProductorRouter>
                )
            },
            {
                path: '/profile',
                element: (
                    <ProductorRouter>
                        <Profile />
                    </ProductorRouter>
                )
            },

            {
                path: 'appoinment/details',
                element: (
                    <ProductorRouter>
                        <AppoitmentDetails />
                    </ProductorRouter>
                )
            },

            {
                path: 'add-doctor',
                element: (
                    <ProductorRouter adminOnly={true}>
                        <AddDoctor />
                    </ProductorRouter>
                )
            },
            {
                path: 'patientlist',
                element: (
                    <ProductorRouter>
                        <PatientList />
                    </ProductorRouter>
                )

            },
            {
                path: 'patientlist/:id',
                element: (
                    <ProductorRouter>
                        <PatientDetails />
                    </ProductorRouter>)
            },

            {
                path: 'doctorList',
                element: (
                    <ProductorRouter>
                        <DoctorList />
                    </ProductorRouter>
                )
            },

            {
                path: 'custom',
                element: (
                    <ProductorRouter>
                        <Custom />
                    </ProductorRouter>
                )
            }
        ]
    },

    {
        path: '*',
        element: <Navigate to="/login" replace />
    }
]);