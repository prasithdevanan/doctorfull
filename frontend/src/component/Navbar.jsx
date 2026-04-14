import React, { use, useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Button from './Button';
import Theme from '../pages/Theme';
import { Images } from '../assets/img';
import { useNavigate, useLocation } from 'react-router-dom';
import { navItems } from '../assets/data';
import { AppContext } from './CreateContext';


function Navbar() {
    const location = useLocation();
    const pathFind = ['/login', '/signin'];
    const hideNavbar = pathFind.includes(location.pathname);
    const navigate = useNavigate();
    const { token, setToken, user } = useContext(AppContext);
    const [load, setLoad] = useState(<i className="bi bi-plus-circle-dotted"></i>);
    const [slice, setSlice] = useState('');

    useEffect(() => {
        localStorage.setItem("token", token);
        const slice = user?.email.slice(0, 1).toUpperCase();
        setSlice(slice);
    }, [token, user?.email]);

    const logout = () => {
        localStorage.removeItem('userId');
        setToken(false);
        navigate('/login');
    }

    return (
        <>
            {
                !hideNavbar &&
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
                                <div className='border border-gray-300 w-5 h-5 p-4 rounded-full flex justify-center items-center bg-gray-100'>
                                    <p>{slice}</p>
                                    {/* <img src={Images.Doc1} alt="img" className='w-8 h-8 object-cover rounded-full' /> */}
                                </div>

                                {/* popup screen */}
                                <div className='absolute top-0 right-0 hidden group-hover:block z-50 p-2 rounded-md w-fit pt-14'>
                                    <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                        <h4 onClick={() => navigate('/profile')} className='text-gray-400 hover:text-(--color-primary) cursor-pointer'>My Profile</h4>
                                        <h4 className='text-gray-400 hover:text-(--color-primary) cursor-pointer' onClick={() => navigate('/appointment')}>Appoinment</h4>
                                        <h4 onClick={() => logout()} className='text-gray-400 hover:text-red-500 cursor-pointer'>Logout</h4>
                                    </div>

                                </div>
                            </div> : <Button children='Login' primary='bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md flex gap-1 justify-center items-center' onclick={() => navigate('/login')} icon={load} />
                    }



                    {/* <Theme /> */}

                </section>
            }

        </>
    )
}

export default Navbar