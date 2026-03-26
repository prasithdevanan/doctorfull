import { Children } from 'react';
import {createBrowserRouter} from 'react-router-dom';
import App from '../App';
import Dashboard from '../Pages/dashboard';
import Login from '../Pages/Login';


export const router = createBrowserRouter([
    {
        path:'/',
        element:<App/>,
        children: [
            {
                index:true,
                element: <Login/>

            }
        ]
    }
])