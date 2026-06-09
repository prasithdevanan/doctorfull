import React, { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';

function Sidebar() {
    const { aToken, dToken } = useContext(AdminContext);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        console.log(isOpen)
    }, [isOpen]);

    const featues = [
        {
            name: "Dashboard",
            path: "/",
            iconClass: "bi bi-house"
        },
        {
            name: "Appointent",
            path: "/appoinment",
            iconClass: "bi bi-calendar"
        },
        {
            name: "Patient List",
            path: "/patientlist",
            iconClass: "bi bi-list"
        },
        ...(aToken ? [{
            name: "Add Doctor",
            path: "/add-doctor",
            iconClass: "bi bi-person-plus"
        }] : []),
        ...aToken ? [
            {
                name: "Doctor List",
                path: "/doctorlist",
                iconClass: "bi bi-list"
            }] : [],
        ...dToken ? [{
            name: "Profile",
            path: "/profile",
            iconClass: "bi bi-person"
        }] : [],
        ...(aToken ? [
            {
                name: "Custom",
                path: "/custom",
                iconClass: "bi bi-list"
            }] : []),
    ];




    return (
        <>
            <section className={`w-fit   ${isOpen ? "sm:w-56" : "sm:w-fit"} bg-white/80 backdrop-blur-lg border-r border-gray-200 flex flex-col py-6 px-2 shadow-sm shrink-0 group/sidebar transition-all duration-300 ease-in-out`}>
                <button onClick={() => setIsOpen(!isOpen)} className="hidden w-fit mx-auto opacity-0 translate-x-2 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 sm:flex cursor-pointer justify-end p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out" title="Toggle Sidebar">
                    <i className={`text-2xl bi ${isOpen ? "bi-layout-sidebar-inset" : "bi-layout-sidebar-inset-reverse"} text-gray-600`}></i>
                </button>
                <div className="flex flex-col gap-2">

                    {featues.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className="group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300"
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Active background */}
                                    <div
                                        className={`absolute inset-0 rounded-xl transition-all duration-300 
              ${isActive ? "bg-blue-50 shadow-sm" : "group-hover:bg-gray-100"}`}
                                    />

                                    {/* Active indicator */}
                                    <span
                                        className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-blue-600 transition-all 
              ${isActive ? "opacity-100" : "opacity-0"}`}
                                    />

                                    {/* Icon */}
                                    <i
                                        className={`${item.iconClass} text-xl z-10 transition-all duration-300 
              ${isActive ? "text-blue-600 scale-110" : "text-gray-600 group-hover:text-gray-900"}`}
                                    />

                                    {/* Text */}
                                    {isOpen && <span
                                        className={`hidden sm:inline z-10 text-sm transition-all duration-300 
              ${isActive ? "font-semibold text-blue-600" : "text-gray-700 group-hover:text-black"}`}
                                    >
                                        {item.name}
                                    </span>}
                                </>
                            )}
                        </NavLink>
                    ))}

                </div>
            </section >
        </>
    )
}

export default Sidebar;