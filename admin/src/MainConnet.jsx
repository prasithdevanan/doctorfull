import React, { useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import Navbar from './Pages/Nav/Navbar';
import Sidebar from './Components/SideBar/Sidebar';
import { Outlet } from 'react-router-dom';
import { AdminContext } from './context/AdminContext';
import { useEffect } from 'react';

function MainConnet() {

    const { aToken, dToken } = useContext(AdminContext);
    const token = aToken || dToken;

    return (
        <>
            {token && <Navbar />}
            <div className='flex w-full h-fit'>
                {token && <Sidebar />}
                <Outlet />
            </div>
            <ToastContainer />
        </>
    )
}

export default MainConnet;