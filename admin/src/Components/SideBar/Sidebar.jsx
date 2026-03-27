import React, { use, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useEffect } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {

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
            name: "Add Doctor",
            path: "/adddoctor",
            iconClass: "bi bi-plus-square"
        },
        {
            name: "Doctor List",
            path: "/doctorlist",
            iconClass: "bi bi-list"
        }
    ];

    console.log(featues)


    return (
        <>
            <section className='w-fit h-[90.5vh] bg-gray-200'>
                <div className='flex flex-col items-start gap-1 w-[160px]'>
                    {
                        featues.map((item, index) => {
                            return (
                                <NavLink key={index} to={item.path} className="flex w-full relative">
                                    <button className='py-2 hover:bg-gray-300 w-full cursor-pointer justify-start items-center flex pl-5 text-[14px]'><i className={`${item.iconClass} px-2 text-(--color-text1) mr-1 text-xl font-bold`}></i>{item.name}</button>
                                    <hr className='border-none border-2 bg-(--color-primary) w-1 outline-none h-full m-auto hidden absolute top-0 right-0 ' />
                                    <hr className='w-full absolute top-0 left-0 border-none hidden bg-[#2563eb2b] h-full' />
                                </NavLink>
                            )
                        })
                    }
                </div>
            </section>
        </>
    )
}

export default Sidebar;