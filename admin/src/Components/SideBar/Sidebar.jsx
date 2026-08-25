import React, { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';

function Sidebar() {
    const { aToken, dToken } = useContext(AdminContext);
    // const [isOpen, setIsOpen] = useState(true);
    const [isOpen, setIsOpen] = useState(() => {
        const saved = localStorage.getItem("isOpen");
        return saved ? JSON.parse(saved) : true;
    });
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
            <aside className={`relative z-[999] flex h-[calc(100vh-100px)] shrink-0 flex-col overflow-visible border-r border-gray-200/70 bg-white/80 shadow-sm backdrop-blur-xl transition-all duration-300 ease-in-out md:h-[calc(100vh-70px)] ${isOpen ? "w-56" : "w-[68px]"}`}>

                <div className="flex flex-1 flex-col gap-1.5 overflow-visible px-2.5 py-5">

                    {featues.map((item, index) => (
                        <NavLink key={index} to={item.path} className="group relative z-10 overflow-visible">
                            {({ isActive }) => (
                                <div className={`relative flex h-11 items-center overflow-visible rounded-xl transition-all duration-200 ${isOpen ? "gap-3 px-3" : "justify-center px-0"} ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>

                                    <span className={`absolute left-0 top-2.5 h-6 w-1 rounded-r-full bg-blue-600 transition-all duration-200 ${isActive ? "opacity-100" : "opacity-0"}`} />

                                    <span className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-500 group-hover:text-gray-800"}`}>
                                        <i className={`${item.iconClass} text-[18px]`} />
                                    </span>

                                    <span className={`relative z-10 overflow-hidden whitespace-nowrap text-sm transition-all duration-300 ${isOpen ? "w-auto opacity-100" : "pointer-events-none w-0 opacity-0"} ${isActive ? "font-semibold text-blue-600" : "font-medium text-gray-600 group-hover:text-gray-900"}`}>
                                        {item.name}
                                    </span>

                                    {!isOpen && (
                                        <span className="pointer-events-none absolute left-full top-1/2 z-[99999] ml-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                                            {item.name}
                                            <span className="absolute right-full top-1/2 -translate-y-1/2 border-y-[5px] border-r-[5px] border-y-transparent border-r-gray-900" />
                                        </span>
                                    )}

                                </div>
                            )}
                        </NavLink>
                    ))}

                </div>

                <div className="shrink-0 border-t border-gray-100 px-2.5 py-3">

                    <button
                        type="button"
                        onClick={() => {
                            const newState = !isOpen;
                            setIsOpen(newState);
                            localStorage.setItem("isOpen", JSON.stringify(newState));
                        }}
                        className={`group flex h-10 w-full cursor-pointer items-center rounded-xl text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 ${isOpen ? "justify-end px-3" : "justify-center"}`}
                        title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >

                        <i className={`bi ${isOpen ? "bi-layout-sidebar-inset" : "bi-layout-sidebar-inset-reverse"} text-lg transition-transform duration-300`} />

                        {isOpen && (
                            <span className="ml-2 text-xs font-medium text-gray-500">
                                Collapse
                            </span>
                        )}

                    </button>

                </div>

            </aside>
        </>
    )
}

export default Sidebar;