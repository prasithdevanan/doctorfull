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

            const { pending, last10 } = data;

            if (pending.length > 0) {
                setOpen(true);
            }

            setData((prev) => {

                const merged = [
                    ...pending,
                    ...last10,
                    ...prev
                ];
                const unique = merged.filter(
                    (item, index, self) =>
                        index === self.findIndex(
                            (t) => t.details._id === item.details._id
                        )
                );

                const sort = unique.sort((a, b) => new Date(b.details.createdAt) - new Date(a.details.createdAt));

                return sort.slice(0, 10);

            });

        });

        socket.on("appointment_status", (data) => {
            setOpen(true);
            setData((prev) => {
                const merged = [
                    ...prev,
                    data
                ];
                const unique = merged.filter(
                    (item, index, self) =>
                        index === self.findIndex(
                            (t) => t.details._id === item.details._id
                        )
                );
                const sort = unique.sort((a, b) => new Date(b.details.createdAt) - new Date(a.details.createdAt));
                return sort;
            });
        });

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
        setData([]);
        socket.disconnect();
        navigate('/login');
    }

    const handleChange = () => {
        setMenu(true);
    }

    return (
        <>
            {
                !hideNavbar &&
                <section className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">

                    <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] flex items-center justify-between">

                        {/* ================= LOGO ================= */}
                        <div
                            className="flex items-center gap-2.5 cursor-pointer shrink-0"
                            onClick={() => navigate('/')}
                        >
                            {backendImg ? (
                                <img
                                    src={backendImg}
                                    alt="Logo"
                                    className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
                                />
                            ) : (
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-(--color-primary)/10 flex items-center justify-center">
                                    <span className="text-(--color-primary) font-bold text-lg">
                                        M
                                    </span>
                                </div>
                            )}

                            {name && (
                                <p className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight">
                                    {name}
                                </p>
                            )}
                        </div>


                        {/* ================= DESKTOP NAV ================= */}
                        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">

                            {navItems.map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.link}
                                    className={({ isActive }) =>
                                        `relative py-2 text-sm font-medium transition-colors duration-200 ${isActive
                                            ? 'text-(--color-primary)'
                                            : 'text-slate-600 hover:text-(--color-primary)'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {item.name}

                                            <span
                                                className={`absolute left-1/2 -bottom-1 h-0.5 -translate-x-1/2 rounded-full bg-(--color-primary) transition-all duration-200 ${isActive ? 'w-5' : 'w-0'
                                                    }`}
                                            />
                                        </>
                                    )}
                                </NavLink>
                            ))}

                        </nav>


                        {/* ================= RIGHT ACTIONS ================= */}
                        <div className="flex items-center gap-2 sm:gap-3">

                            {token ? (
                                <>
                                    {/* Notification */}
                                    <button
                                        type="button"
                                        className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-(--color-primary) hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                                        onClick={() => {
                                            navigate('/notification', { state: data });
                                            setOpen(false);
                                        }}
                                        title="Notifications"
                                    >
                                        <i className="bi bi-bell text-lg"></i>

                                        {open && (
                                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                                        )}
                                    </button>


                                    {/* Profile */}
                                    <div className="relative">

                                        <button
                                            type="button"
                                            onClick={() => setOpenMenu(!openMenu)}
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-(--color-primary)/10 text-(--color-primary) border border-(--color-primary)/10 flex items-center justify-center text-sm font-semibold hover:bg-(--color-primary)/15 transition-colors duration-200 cursor-pointer"
                                        >
                                            {slice}
                                        </button>


                                        {/* Profile Dropdown */}
                                        {openMenu && (
                                            <div className="absolute right-0 top-12 sm:top-13 w-52 bg-white border border-slate-200 rounded-xl shadow-[0_8px_25px_rgba(15,23,42,0.10)] overflow-hidden">

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigate('/profile');
                                                        setOpenMenu(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150 cursor-pointer"
                                                >
                                                    <i className="bi bi-person text-base text-(--color-primary)"></i>
                                                    <span>My Profile</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigate('/appointment');
                                                        setOpenMenu(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150 cursor-pointer"
                                                >
                                                    <i className="bi bi-calendar-check text-base text-(--color-primary)"></i>
                                                    <span>Appointments</span>
                                                </button>

                                                <div className="border-t border-slate-100"></div>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        logout();
                                                        setOpenMenu(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                                                >
                                                    <i className="bi bi-box-arrow-right text-base"></i>
                                                    <span>Logout</span>
                                                </button>

                                            </div>
                                        )}

                                    </div>

                                </>
                            ) : (
                                <Button
                                    children="Login"
                                    primary="bg-(--color-primary) text-white hover:opacity-90 px-4 sm:px-5 py-2 rounded-lg flex items-center justify-center cursor-pointer text-sm font-medium transition-opacity duration-200"
                                    onclick={() => navigate('/login')}
                                />
                            )}


                            {/* Mobile Menu Button */}
                            <button
                                type="button"
                                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-(--color-primary) hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                                onClick={() => setMenu(true)}
                                title="Menu"
                            >
                                <i className="bi bi-list text-xl sm:text-2xl"></i>
                            </button>

                        </div>

                    </div>


                    {/* ================= MOBILE MENU ================= */}
                    {menu && (
                        <div className={`fixed w-60 right-0 top-0 h-full transform transition-transform duration-500 ease-in-out ${menu ? "translate-x-0" : "translate-x-full"}`}>
                            <div className='absolute top-0 right-0 flex flex-col w-full justify-start items-center h-screen py-10 gap-10'>
                                {/* Backdrop */}
                                <div
                                    className="absolute inset-0"
                                    onClick={() => setMenu(false)}
                                />

                                {/* Drawer */}
                                <div className="absolute top-0 right-0 h-full w-[350px] max-w-[110%] bg-gray-100 shadow-[-8px_0_30px_rgba(15,23,42,0.10)]">

                                    {/* Drawer Header */}
                                    <div className="h-16 sm:h-[70px] px-5 flex items-center justify-between border-b border-slate-100">

                                        <div className="flex items-center gap-2">
                                            {backendImg && (
                                                <img
                                                    src={backendImg}
                                                    alt="Logo"
                                                    className="w-8 h-8 object-contain"
                                                />
                                            )}

                                            {name && (
                                                <span className="font-semibold text-slate-800">
                                                    {name}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setMenu(false)}
                                            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors duration-150 cursor-pointer"
                                        >
                                            <i className="bi bi-x-lg text-sm"></i>
                                        </button>

                                    </div>


                                    {/* Links */}
                                    <nav className="px-5 py-6">

                                        <div className="flex flex-col gap-1">

                                            {navItems.map((item, index) => (
                                                <NavLink
                                                    key={index}
                                                    to={item.link}
                                                    onClick={() => setMenu(false)}
                                                    className={({ isActive }) =>
                                                        `px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 ${isActive
                                                            ? 'bg-(--color-primary)/10 text-(--color-primary)'
                                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                        }`
                                                    }
                                                >
                                                    {item.name}
                                                </NavLink>
                                            ))}

                                        </div>

                                    </nav>

                                </div>
                            </div>
                        </div>
                    )}

                </section>
            }

        </>
    )
}

export default Navbar