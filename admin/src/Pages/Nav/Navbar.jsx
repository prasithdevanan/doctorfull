import React, { useContext } from 'react';
import { Images } from '../../Components/Images';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';

function Navbar() {
    const body = document.querySelector('body')
    body.style.overflow = 'hidden';
    const navigate = useNavigate();
    const { setAToken, setDToken, backendImg, name } = useContext(AdminContext);

    const atoken = localStorage.getItem("aToken") ? "Admin" : "Doctor";
    const [logout, setLogout] = useState(false);

    const logOutHandle = () => {
        console.log("calling function working")
        setLogout(true);
    }

    const logoutFunction = () => {
        console.log("logout");
        localStorage.removeItem('aToken');
        localStorage.removeItem('dToken');
        localStorage.removeItem('dEmail');
        setAToken('')
        setDToken('')
        navigate('/login');
        setLogout(false);
    }

    return (
        <>
            <nav className='bg-white/50 shadow backdrop-blur-lg sticky top-0 z-50'>
                <section className="flex justify-between items-center px-6 sm:px-10 py-3">

                    {/* Left - Logo */}
                    <div className="flex items-center gap-3">
                        {backendImg ? (
                            <div className="flex items-center gap-2">
                                <img src={backendImg} alt="logo" className="w-9 h-9 rounded-lg object-cover shadow-sm" />
                                <p className="hidden sm:block font-semibold text-gray-800 tracking-wide">
                                    {name}
                                </p>
                            </div>
                        ) : (
                            <p className="font-semibold text-gray-800">Logo</p>
                        )}
                    </div>

                    {/* Right - Profile */}
                    <div className="relative group">
                        <div className="flex items-center gap-3 cursor-pointer px-2 py-1 rounded-xl hover:bg-gray-100 transition">

                            <img
                                src={Images.Profile}
                                alt="profile"
                                className="w-9 h-9 rounded-full border border-gray-300 object-cover"
                            />

                            <p className="hidden sm:block text-sm text-gray-700">
                                {atoken}
                            </p>

                            {/* Arrow */}
                            <i className="bi bi-chevron-down text-gray-600 group-hover:rotate-180 transition"></i>
                        </div>

                        {/* Dropdown */}
                        <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">

                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-xl cursor-pointer">
                                Profile
                            </button>

                            <button
                                onClick={() => setLogout(true)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 rounded-b-xl cursor-pointer"
                            >
                                Logout
                            </button>

                        </div>
                    </div>

                </section>
            </nav>


            {/* //logout */}
            {logout && (
                <section
                    className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center"
                    onClick={() => setLogout(false)}
                >
                    <div
                        className="bg-white w-full max-w-sm mx-4 p-6 rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Confirm Logout
                        </h2>

                        <p className="text-sm text-gray-500 mb-6">
                            You will be signed out of your account.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setLogout(false)}
                                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={logoutFunction}
                                className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}

export default Navbar