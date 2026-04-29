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
            <nav className='bg-gray-200 sticky top-0 z-50'>
                <section className='flex justify-between px-8 py-4 items-center pr-10'>
                    <div>
                        {backendImg ? <div className='flex items-center gap-2'> <img src={backendImg} alt="img" className='w-10' /> <p>{name}</p></div> : <p>logo</p>}
                    </div>
                    <div>
                        <div className='flex gap-2 items-center relative group'>
                            <img src={Images.Profile} alt="img" className='w-10' />
                            <p>{atoken}</p>

                            <div className='absolute hidden group-hover:block top-0 right-0 z-[999]'>
                                <div className='mt-8 mr-4 bg-(--color-bg) shadow-md px-3'>
                                    <p className='cursor-pointer p-2'>Profile</p>
                                    <p className='cursor-pointer hover:text-red-600 p-2' onClick={() => logOutHandle()}>Logout</p>
                                </div>
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>
                </section>
                {

                    logout && (
                        <section
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                            onClick={() => setLogout(false)}
                        >
                            <div
                                className="bg-white w-full max-w-md mx-4 p-6 rounded-2xl shadow-xl transform transition-all"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Title */}
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                    Logout
                                </h2>

                                {/* Message */}
                                <p className="text-sm text-gray-500 mb-6">
                                    Are you sure you want to logout?
                                </p>

                                {/* Actions */}
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setLogout(false)}
                                        className=" cursor-pointer px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={logoutFunction}
                                        className=" cursor-pointer px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </section>
                    )
                }


            </nav>
        </>
    )
}

export default Navbar