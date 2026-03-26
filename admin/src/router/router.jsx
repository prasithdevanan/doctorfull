import { Children } from 'react';
import {createBrowserRouter, Navigate} from 'react-router-dom';
import App from '../App';
import Dashboard from '../Pages/dashboard';
import Login from '../Pages/Login';
import ProductorRouter from './ProductorRouter';


const token = localStorage.getItem('aToken');

export const router = createBrowserRouter([
    {
        path:'/',
        element:<App/>,
        children: [
            {
                index:true,
                path:'/login',
                element:token ? <Navigate to='/'/>:<Login/>

            },
            {
                path:'/',
                element:<ProductorRouter><Dashboard/></ProductorRouter>
            }
        ]
    }
])