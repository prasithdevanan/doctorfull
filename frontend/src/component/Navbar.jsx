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
    const [menu, setMenu] = useState(false);

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

    const handleChange = () => {
        setMenu(true);
        console.log('clicked');
    }

    return (
        <>
            {
                !hideNavbar &&
                <section className='flex justify-between lg:px-10 md:px-5 px-4 py-5 items-center border-b border-gray-300 mb-4 sticky top-0 bg-white/50 backdrop-blur-sm z-100'>
                    <h4>Logo</h4>
                    <ul className='hidden lg:flex gap-10'>
                        {
                            navItems.map((item, index) => (
                                <NavLink key={index} to={item.link}>
                                    <li className='py-1'>{item.name}</li>
                                    <hr className='border-none border-2 bg-(--color-primary) w-3/5 outline-none h-0.5 m-auto hidden' />
                                </NavLink>
                            ))

                        }
                    </ul>

                    <div className='flex'>
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
                                </div> : <Button children='Login' primary='bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md flex gap-1 justify-center items-center cursor-pointer' onclick={() => navigate('/login')} />
                        }
                        <div className='lg:hidden flex justify-center items-center ml-5 cursor-pointer' onClick={() => setMenu(true)}>
                            <p><i className="bi bi-list text-gray-500 text-3xl hover:text-(--color-primary)"></i></p>
                        </div>
                        {
                            menu && <div className={` fixed w-60 right-0 top-0 h-ful transform transition-transform duration-500 ease-in-out ${menu ? "translate-x-0" : "translate-x-full"}`}>
                                <div className='absolute top-0 right-0 flex flex-col bg-gray-100 w-full justify-start items-center h-screen py-10 gap-10'>
                                    <div className='mx-auto flex w-fit justify-center px-2 hover:bg-gray-100 py-1 rounded-md cursor-pointer' onClick={() => setMenu(false)}>
                                        <i
                                            className="bi bi-x text-3xl cursor-pointer"
                                        ></i>
                                    </div>
                                    <ul className='flex flex-col lg:hidden gap-10'>
                                        {
                                            navItems.map((item, index) => (
                                                <NavLink key={index} to={item.link} onClick={() => setMenu(false)}>
                                                    <li className='py-1'>{item.name}</li>
                                                    <hr className='border-none border-2 bg-(--color-primary) w-3/4 outline-none h-0.5 mx-auto hidden' />
                                                </NavLink>
                                            ))

                                        }
                                    </ul>
                                </div>

                            </div>
                        }
                    </div>


                    {/* <Theme /> */}

                </section >
            }

        </>
    )
}

export default Navbar