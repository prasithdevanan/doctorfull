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
                    logout &&
                    <section className={`fixed w-screen h-screen bg-[#00000036] top-0 left-0 justify-center items-center flex z-[999]`} onClick={() => setLogout(false)} >
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