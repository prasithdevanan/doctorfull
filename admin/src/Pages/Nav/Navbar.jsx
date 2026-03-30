import React, { useContext } from 'react';
import { Images } from '../../Components/Images';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';

function Navbar() {
    const body = document.querySelector('body')
    body.style.overflow = 'hidden';
    const navigate = useNavigate();
    const { setAToken } = useContext(AdminContext);

    const atoken = localStorage.getItem("aToken") ? "Admin" : "Doctor";
    const [logout, setLogout] = useState(false);
    console.log(logout);

    const logOutHandle = () => {
        console.log("calling function working")
        setLogout(true);
    }

    const logoutFunction = () => {
        localStorage.removeItem('aToken');
        setAToken('')
        navigate('/login');
        setLogout(false);
    }

    return (
        <>
            <nav className='relative bg-gray-200 sticky'>
                <section className='flex justify-between px-8 py-4 items-center pr-10'>
                    <div>
                        <h1>Logo</h1>
                    </div>
                    <div>
                        <div className='flex gap-2 items-center  relative group'>
                            <img src={Images.AdminProfile} alt="img" />
                            <p>{atoken}</p>

                            <div className='absolute hidden group-hover:block top-0 right-0'>
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
                    logout &&
                    <section className={`absolute w-screen h-screen bg-[#00000036] top-0 left-0 justify-center items-center flex`} onClick={() => setLogout(false)} >
                        <div className='bg-(--color-bg) px-4 py-2 rounded-md w-[40%] flex flex-col items-center gap-4' onClick={(e) => e.stopPropagation()}>
                            <p className='text-(--color-primary) font-bold'>Logout</p>
                            <p>Are you sure want to Logout</p>
                            <div className='flex gap-2'>
                                <button onClick={() => setLogout(false)} className='p-2 bg-gray-100 rounded-md cursor-pointer'>Cancel</button>
                                <button className={`p-2 bg-red-600 text-(--color-white) rounded-md cursor-pointer`} onClick={() => logoutFunction()}>Logout</button>
                            </div>
                        </div>
                    </section>
                }

            </nav>
        </>
    )
}

export default Navbar