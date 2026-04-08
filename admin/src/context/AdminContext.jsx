import React, { createContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
    const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");

    useEffect(() => {
        const handleStorageChange = () => {
            setAToken(localStorage.getItem('aToken') || "");
            setDToken(localStorage.getItem('dToken') || "");
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [])

    const BackendUrl = import.meta.env.VITE_BACKEND_URL;


    const value = {

        aToken, setAToken, BackendUrl, dToken, setDToken

    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}


export default AdminContextProvider;

