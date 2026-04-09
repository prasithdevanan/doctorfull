import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {

    const BackendUrl = import.meta.env.VITE_BACKEND_URL;
    // const navigate = useNavigate();

    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
    const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");

    // Sync localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            setAToken(localStorage.getItem('aToken') || "");
            setDToken(localStorage.getItem('dToken') || "");
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Validate token
    useEffect(() => {
        const validateToken = async () => {
            if (!aToken && !dToken) {
                return;
            }

            try {
                const res = await axios.post(`${BackendUrl}/api/validation`, {}, {
                    headers: {
                        Authorization: `Bearer ${aToken || dToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log("Token is valid:", res.data);

            } catch (error) {
                console.log("Error:", error.response?.data);

                localStorage.removeItem('aToken');
                localStorage.removeItem('dToken');
                setAToken('');
                setDToken('');
            }
        };

        validateToken();

    }, []); // ✅ fixed

    const value = {
        aToken,
        setAToken,
        dToken,
        setDToken,
        BackendUrl
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;