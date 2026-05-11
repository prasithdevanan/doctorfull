import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Button from './Button';
import Theme from '../pages/Theme';
import { Images } from '../assets/img';
import { useNavigate, useLocation } from 'react-router-dom';
import { navItems } from '../assets/data';
import { AppContext } from './CreateContext';
import axios from 'axios';
import { socket } from '../socket/socket';


function Navbar() {
    const location = useLocation();
    const pathFind = ['/login', '/signin'];
    const hideNavbar = pathFind.includes(location.pathname);
    const navigate = useNavigate();
    const { token, setToken, user, setUserId, setUser, data, setData } = useContext(AppContext);
    const [load, setLoad] = useState(<i className="bi bi-plus-circle-dotted"></i>);
    const [slice, setSlice] = useState('');
    const [menu, setMenu] = useState(false);
    const { BackendUrl, backendImg, name } = useContext(AppContext);
    const [openMenu, setOpenMenu] = useState(false);
    // const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);

    //socket conection
    useEffect(() => {

        if (user?.id) {
            socket.emit("register", {
                userId: user.id,
                role: "Patient"
            });
        }
    }, [user]);


    useEffect(() => {
        socket.on("pending_notifications", (data) => {
            const { pending, last10} = data;
            if (pending.length > 0 ) {
                setOpen(true);
            }
            console.log(pending, last10);

            setData((prev) => [...prev, ...last10]);
            console.log(data);
        });

        socket.on("appointment_status", (data) => {
            setOpen(true);
            setData((prev) => [...prev, data]);
            console.log(data);
        })

        return () => {
            setData([]);
            socket.off("appointment_status");
            socket.off("pending_notifications");
            socket.disconnect();
        }

    }, []);


    useEffect(() => {
        localStorage.setItem("token", token);
        const slice = user?.email.slice(0, 1).toUpperCase();
        setSlice(slice);
    }, [token, user?.email]);

    const logout = () => {
        localStorage.removeItem('userId');
        setToken(false);
        setUserId(null);
        setUser(null);
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
                <section className='flex justify-between lg:px-10 md:px-5 px-4 py-5 items-center border-b border-gray-300 sticky top-0 bg-white/50 backdrop-blur-sm z-100'>
                    <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate('/')} >
                        {
                            backendImg ? <img src={backendImg} alt="img" className='w-10' /> : <h4>Logo</h4>
                        }
                        {
                            name && <p>{name}</p>
                        }

                    </div>

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
                                <>
                                    <div className='mr-6'>
                                        {/* //----Notification-------------- */}
                                        <div className='px-2 py-1 bg-gray-100 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-200 relative' onClick={() =>{navigate('/notification', {state: data}); setOpen(false)}}>
                                            <i className="bi bi-bell text-xl text-gray-500 hover:text-(--color-primary)"></i>
                                            <div >
                                                {
                                                    open &&
                                                    <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full'></span>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                    <div className='relative cursor-pointer group'>
                                        <div className=' border border-gray-300 w-5 h-5 p-4 rounded-full flex justify-center items-center bg-gray-100' onClick={() => setOpenMenu(!openMenu)}>
                                            <p>{slice}</p>
                                            {/* <img src={Images.Doc1} alt="img" className='w-8 h-8 object-cover rounded-full' /> */}
                                        </div>

                                        {/* popup screen */}
                                        <div className={`${openMenu ? 'block' : 'hidden'} absolute top-6 right-0 lg:group-hover:block z-50 pt-4`}>

                                            <div className='w-56 bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl overflow-hidden animate-fadeIn'>

                                                <div
                                                    onClick={() => { navigate('/profile'); setOpenMenu(false); }}
                                                    className='flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-100 transition-all duration-300'
                                                >
                                                    <i className="bi bi-person text-lg text-(--color-primary)"></i>
                                                    <p className='text-gray-700 font-medium'>My Profile</p>
                                                </div>

                                                <div
                                                    onClick={() => { navigate('/appointment'); setOpenMenu(false); }}
                                                    className='flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-100 transition-all duration-300'
                                                >
                                                    <i className="bi bi-calendar-check text-lg text-(--color-primary)"></i>
                                                    <p className='text-gray-700 font-medium'>Appointments</p>
                                                </div>

                                                <div className='border-t border-gray-200'></div>

                                                <div
                                                    onClick={() => { logout(); setOpenMenu(false); }}
                                                    className='flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-red-50 transition-all duration-300'
                                                >
                                                    <i className="bi bi-box-arrow-right text-lg text-red-500"></i>
                                                    <p className='text-red-500 font-semibold'>Logout</p>
                                                </div>

                                            </div>

                                        </div>
                                    </div> </> : <Button children='Login' primary='bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md flex gap-1 justify-center items-center cursor-pointer' onclick={() => navigate('/login')} />
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