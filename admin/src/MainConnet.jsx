import React, { useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import Navbar from './Pages/Nav/Navbar';
import Sidebar from './Components/SideBar/Sidebar';
import { Outlet } from 'react-router-dom';
import { AdminContext } from './context/AdminContext';
import "react-toastify/dist/ReactToastify.css";

function MainConnet() {

    const { aToken, dToken } = useContext(AdminContext);
    const token = aToken || dToken;

    return (
        <>
            {token && <Navbar />}
            <div className='flex w-full h-fit'>
                {token && <div className="relative z-[999] overflow-visible"><Sidebar /> </div>}
                <main className="relative z-0 min-w-0 flex-1 overflow-hidden"><Outlet /></main>
            </div>
            <ToastContainer />
        </>
    )
}

export default MainConnet;