import React, { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { NavLink } from 'react-router-dom';

function Sidebar() {
    const { aToken } = useContext(AdminContext);

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
        ...aToken && [{
            name: "Add Doctor",
            path: "/add-doctor",
            iconClass: "bi bi-person-plus"
        }],
        {
            name: "Doctor List",
            path: "/doctorlist",
            iconClass: "bi bi-list"
        },
        {
            name: "Custom",
            path: "/custom",
            iconClass: "bi bi-list"
        }
    ];




    return (
        <>
            <section className="h-screen w-20 sm:w-40 bg-gray-200 flex flex-col py-4 shrink-0">

                <div className="flex flex-col gap-1">

                    {featues.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className="relative flex items-center w-full gap-3 px-3 py-2 text-sm transition hover:bg-gray-300"
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={`absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r-md transition ${isActive ? "opacity-100" : "opacity-0"
                                            }`}
                                    />

                                    <i className={`${item.iconClass} text-xl ${isActive ? "text-blue-600" : "text-gray-700"
                                        }`} />

                                    <span className={`hidden sm:inline ${isActive ? "font-semibold text-blue-600" : ""
                                        }`}>
                                        {item.name}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}

                </div>

            </section>
        </>
    )
}

export default Sidebar;