import React, { use, useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Button from './Button';
import Theme from '../pages/Theme';
import { Images } from '../assets/img';
import { useNavigate } from 'react-router-dom';
import { navItems } from '../assets/data';
import { AppContext } from './CreateContext';


function Navbar() {
    const navigate = useNavigate();
    const { token, setToken } = useContext(AppContext);
    const [load, setLoad] = useState(<i className="bi bi-plus-circle-dotted"></i>);

    useEffect(() => {
        localStorage.setItem("token", token);
    }, [token]);

    return (
        <>
            <section className='flex justify-between px-10 py-5 items-center border-b border-gray-300 mb-4'>
                <h4>Logo</h4>
                <ul className='hidden md:flex gap-10'>
                    {
                        navItems.map((item, index) => (
                            <NavLink key={index} to={item.link}>
                                <li className='py-1'>{item.name}</li>
                                <hr className='border-none border-2 bg-(--color-primary) w-3/5 outline-none h-0.5 m-auto hidden' />
                            </NavLink>
                        ))

                    }
                </ul>
                {
                    token ?
                        <div className='relative cursor-pointer group'>
                            <div>
                                <img src={Images.Doc1} alt="img" className='w-8 h-8 object-cover rounded-full' />
                            </div>
                            <div className='absolute top-0 right-0 hidden group-hover:block z-50 p-2 rounded-md w-fit pt-14'>
                                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                    <h4 onClick={() => navigate('/profile')} className='text-gray-400 hover:text-(--color-primary) cursor-pointer'>My Profile</h4>
                                    <h4 className='text-gray-400 hover:text-(--color-primary) cursor-pointer'>Appoinment</h4>
                                    <h4 onClick={() => setToken(false)} className='text-gray-400 hover:text-red-500 cursor-pointer'>Logout</h4>
                                </div>

                            </div>
                        </div> : <Button children='Create Account' primary='bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md flex gap-1 justify-center items-center' onclick={() => navigate('/login')} icon={load} />
                }



                {/* <Theme /> */}

            </section>
        </>
    )
}

export default Navbar