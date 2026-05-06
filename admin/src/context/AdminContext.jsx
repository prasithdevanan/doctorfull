import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {

    const BackendUrl = import.meta.env.VITE_BACKEND_URL;

    const [aToken, setAToken] = useState(() => localStorage.getItem('aToken'));
    const [dToken, setDToken] = useState(() => localStorage.getItem('dToken'));


    if (aToken) {
        localStorage.removeItem('dToken');
        localStorage.removeItem('dEmail');
        localStorage.removeItem('id');
    }

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

    }, []);


    /// get logo
    useEffect(() => {
        const feach = async () => {
            try {
                const res = await axios.get(`${BackendUrl}/api/admin/logo`,);

                console.log(res.data.logo.image);
                setBackendImg(res.data.logo.image);
                setName(res.data.logo.name);
            } catch (error) {
                console.log(error);
            }
        }
        feach();
    }, [BackendUrl, aToken])
    const [backendImg, setBackendImg] = useState(null);
    const [name, setName] = useState(null);


    const [id, setId] = useState(() => localStorage.getItem('id'));
    const [user, setUser] = useState(null);
    ///get the user
    useEffect(() => {
        if (!id) {
            return;
        }
        const fetch = async () => {
            try {
                const res = await axios.get(`${BackendUrl}/api/doctor/doctor/${id}`, {
                    headers: {
                        Authorization: `Bearer ${dToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                console.log(res.data.doctor);
                setUser(res.data.doctor);
            } catch (error) {
                console.log(error);
            }
        }
        fetch();
    },[])

    const value = {
        aToken,
        setAToken,
        dToken,
        user,
        setUser,
        setDToken,
        BackendUrl,
        backendImg,
        name
    };
    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;