import { Children } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Dashboard from '../Pages/Admin/dashboard';
import Login from '../Pages/login/Login';
import ProductorRouter from './ProductorRouter';
import Appoiment from '../Pages/Admin/Appoiment';
import AddDoctor from '../Pages/Admin/AddDoctor';
import DoctorList from '../Pages/Admin/DoctorList';


const token = localStorage.getItem('aToken');

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                path: '/login',
                element: token ? <Navigate to='/' /> : <Login />

            },
            {
                path: '/',
                element: <ProductorRouter><Dashboard /></ProductorRouter>
            },
            {
                path: '/appoinment',
                element: <Appoiment />
            },
            {
                path: '/adddoctor',
                element: <AddDoctor />
            },
            {
                path: '/doctorList',
                element: <DoctorList />
            }
        ]
    }
])