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
            {/* Mobile / Tablet message */}
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 lg:hidden">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.8}
                            stroke="currentColor"
                            className="h-8 w-8 text-red-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900">
                        Desktop Required
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        This dashboard is optimized for desktop screens.
                        Please open it on a larger screen to continue.
                    </p>
                </div>
            </div>

            {/* Desktop dashboard */}
            <div className="hidden lg:block">
                {token && <Navbar />}

                <div className="flex w-full h-fit">
                    {token && (
                        <div className="relative z-[1] overflow-visible">
                            <Sidebar />
                        </div>
                    )}

                    <main className="relative z-0 min-w-0 flex-1 overflow-hidden">
                        <Outlet />
                    </main>
                </div>

                <ToastContainer />
            </div>
        </>
    )
}

export default MainConnet;