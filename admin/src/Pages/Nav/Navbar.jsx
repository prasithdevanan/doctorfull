import React, { useContext, useEffect } from 'react';
import { Images } from '../../Components/Images';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { socket } from '../../socket/socket';
import { toast } from 'react-toastify';

function Navbar() {
    const body = document.querySelector('body')
    body.style.overflow = 'hidden';
    const navigate = useNavigate();
    const { setAToken, setDToken, backendImg, name, setUser, BackendUrl, user } = useContext(AdminContext);
    const atoken = localStorage.getItem("aToken") ? "Admin" : "Doctor";
    const [logout, setLogout] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const title = atoken === "Admin" ? "Admin Dashboard" : "Doctor Dashboard";
    document.title = title;

    //Check the enable or not
    useEffect(() => {
        if (atoken === "Admin") return;
        setEnabled(user?.available);
    }, [user]);

    // logout function
    const logOutHandle = () => {
        setLogout(true);
    }

    const logoutFunction = () => {
        localStorage.removeItem('aToken');
        localStorage.removeItem('dToken');
        localStorage.removeItem('dEmail');
        localStorage.removeItem('id');
        setAToken(null);
        setDToken(null);
        setLogout(false);
        setUser(null);
        socket.disconnect();
        navigate('/login', { replace: true });
    }

    const toggleAvailability = () => {
        setEnabled(!enabled);
        try {
            const updateAvailability = async () => {
                const res = await axios.post(`${BackendUrl}/api/doctor/doctor/profile/update/${localStorage.getItem("id")}`, { available: !enabled });

                if (res.data.success) {
                    if (!enabled) {
                        toast.success("You are available now");
                    } else {
                        toast.error("You are not available now");
                    }
                }
            }

            updateAvailability();
        } catch (err) {
            if (err.response.status === 401) {
                logout();
            } else {
                toast.error("Error fetching doctor info:", err);
            }
        }
    };

    useEffect(() => {
        const handlePageHide = () => {
            console.log("Page hidden");
            socket.disconnect();
        };

        window.addEventListener("pagehide", handlePageHide);
        window.addEventListener("beforeunload", handlePageHide);

        return () => {
            window.removeEventListener("pagehide", handlePageHide);
            window.removeEventListener("beforeunload", handlePageHide);
        };
    }, []);
    // onclick


    return (
        <>
            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/80 backdrop-blur-xl">
                <nav className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* LEFT - BRAND */}
                    <div
                        onClick={() => navigate("/")}
                        className="flex min-w-0 cursor-pointer items-center gap-3"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
                            {backendImg ? (
                                <img
                                    src={backendImg}
                                    alt="Logo"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-sm font-bold text-gray-500">
                                    CMS
                                </span>
                            )}
                        </div>

                        <div className="hidden min-w-0 sm:block">
                            <p className="max-w-[180px] truncate text-sm font-semibold tracking-tight text-gray-900 lg:max-w-[260px]">
                                {name || "CMS Dashboard"}
                            </p>

                            <p className="text-[11px] font-medium text-gray-400">
                                Management Portal
                            </p>
                        </div>

                        <span className="hidden rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600 md:inline-flex">
                            {atoken}
                        </span>
                    </div>


                    {/* ================= CENTER - AVAILABILITY ================= */}
                    {atoken === "Doctor" && (
                        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
                            <button
                                type="button"
                                onClick={toggleAvailability}
                                className="group flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                            >
                                <span
                                    className={`relative h-6 w-11 rounded-full p-1 transition-colors duration-300 ${enabled
                                            ? "bg-emerald-500"
                                            : "bg-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${enabled
                                                ? "translate-x-5"
                                                : "translate-x-0"
                                            }`}
                                    />
                                </span>

                                <span
                                    className={`flex items-center gap-1.5 text-xs font-semibold ${enabled
                                            ? "text-emerald-600"
                                            : "text-gray-500"
                                        }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${enabled
                                                ? "bg-emerald-500"
                                                : "bg-gray-400"
                                            }`}
                                    />

                                    {enabled ? "Available" : "Unavailable"}
                                </span>
                            </button>
                        </div>
                    )}


                    {/* ================= RIGHT - PROFILE ================= */}
                    <div className="relative">

                        <button
                            type="button"
                            onClick={() => setProfileOpen((prev) => !prev)}
                            className="flex cursor-pointer items-center gap-2 rounded-xl border border-transparent px-2 py-1.5 transition-all hover:border-gray-200 hover:bg-gray-50 sm:gap-3"
                        >
                            <div className="relative">
                                <img
                                    src={Images.Profile}
                                    alt="Profile"
                                    className="h-9 w-9 rounded-full border border-gray-200 object-cover"
                                />

                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                            </div>

                            <div className="hidden text-left sm:block">
                                <p className="text-xs font-semibold text-gray-800">
                                    {atoken}
                                </p>

                                <p className="text-[11px] text-gray-400">
                                    Account
                                </p>
                            </div>

                            <i
                                className={`bi bi-chevron-down text-xs text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>


                        {/* ================= PROFILE DROPDOWN ================= */}
                        {profileOpen && (
                            <div className="absolute right-0 top-full z-[100] mt-2 w-60 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50">

                                {/* Profile info */}
                                <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-4">
                                    <div className="flex items-center gap-3">

                                        <img
                                            src={Images.Profile}
                                            alt="Profile"
                                            className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                                        />

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-gray-800">
                                                {name || "User"}
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                {atoken}
                                            </p>
                                        </div>

                                    </div>
                                </div>


                                {/* Menu */}
                                <div className="p-1.5">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate("/profile");
                                        }}
                                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                                    >
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                            <i className="bi bi-person" />
                                        </span>

                                        <span>
                                            <span className="block font-medium">
                                                Profile
                                            </span>

                                            <span className="block text-[11px] text-gray-400">
                                                View your account
                                            </span>
                                        </span>
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileOpen(false);
                                            setLogout(true);
                                        }}
                                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                                    >
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                                            <i className="bi bi-box-arrow-right" />
                                        </span>

                                        <span>
                                            <span className="block font-medium">
                                                Logout
                                            </span>

                                            <span className="block text-[11px] text-red-400">
                                                Sign out securely
                                            </span>
                                        </span>
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>
                </nav>


                {/* ================= MOBILE AVAILABILITY ================= */}
                {atoken === "Doctor" && (
                    <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-2 md:hidden">
                        <button
                            type="button"
                            onClick={toggleAvailability}
                            className="flex w-full items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className={`h-2 w-2 rounded-full ${enabled
                                            ? "bg-emerald-500"
                                            : "bg-gray-400"
                                        }`}
                                />

                                <span className="text-xs font-semibold text-gray-600">
                                    Availability
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span
                                    className={`text-xs font-semibold ${enabled
                                            ? "text-emerald-600"
                                            : "text-gray-500"
                                        }`}
                                >
                                    {enabled ? "Available" : "Unavailable"}
                                </span>

                                <span
                                    className={`relative h-5 w-9 rounded-full p-0.5 ${enabled
                                            ? "bg-emerald-500"
                                            : "bg-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${enabled ? "translate-x-4" : ""
                                            }`}
                                    />
                                </span>
                            </div>
                        </button>
                    </div>
                )}
            </header>


            {/* ================= PROFILE MOBILE OVERLAY ================= */}
            {profileOpen && (
                <div
                    className="fixed inset-0 z-[40] bg-black/10"
                    onClick={() => setProfileOpen(false)}
                />
            )}


            {/* ================= LOGOUT MODAL ================= */}
            {logout && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950/40 px-4 backdrop-blur-sm"
                    onClick={() => setLogout(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl"
                    >

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="flex items-start gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                    <i className="bi bi-box-arrow-right text-lg" />
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        Sign out?
                                    </h2>

                                    <p className="mt-1 text-sm leading-5 text-gray-500">
                                        Are you sure you want to sign out of
                                        your CMS account?
                                    </p>
                                </div>

                            </div>
                        </div>


                        {/* Modal Actions */}
                        <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/70 px-6 py-4">

                            <button
                                type="button"
                                onClick={() => setLogout(false)}
                                className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={logoutFunction}
                                className="cursor-pointer rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 active:scale-[0.98]"
                            >
                                Sign out
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar