import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {

    const BackendUrl = import.meta.env.VITE_BACKEND_URL;

    const [aToken, setAToken] = useState(() => localStorage.getItem('aToken'));
    const [dToken, setDToken] = useState(() => localStorage.getItem('dToken'));
    const id = localStorage.getItem("id");
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(false);
    const [logoLoading, setLogoLoading] = useState(false);


    useEffect(() => {
        if (aToken) {
            localStorage.removeItem("dToken");
            localStorage.removeItem("dEmail");
            localStorage.removeItem("id");
        }
    }, [aToken]);

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
                if (!res.data.success) {
                    localStorage.removeItem('aToken');
                    localStorage.removeItem('dToken');
                    localStorage.removeItem('dEmail');
                    localStorage.removeItem('id');
                    setAToken('');
                    setDToken('');

                }

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
            setLogoLoading(true);
            try {
                const res = await axios.get(`${BackendUrl}/api/admin/logo`,);
                setBackendImg(res.data.logo.image);
                setName(res.data.logo.name);
            } catch (error) {
                console.log(error);
            } finally {
                setLogoLoading(false);
            }
        }
        feach();
    }, [BackendUrl, aToken])

    const [backendImg, setBackendImg] = useState(null);
    const [name, setName] = useState(null);



    useEffect(() => {
        const fetchUser = async () => {
            if (!id || !dToken) return;

            setUserLoading(true);

            try {
                const res = await axios.get(
                    `${BackendUrl}/api/doctor/doctor/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${dToken}`,
                        },
                    }
                );

                setUser(res.data.doctor);
            } catch (err) {
                console.log(err);
                setUser(null);
            } finally {
                setUserLoading(false);
            }
        };

        fetchUser();
    }, [id, dToken, BackendUrl]);

    const value = {
        aToken,
        setAToken,
        dToken,
        user,
        setUser,
        setDToken,
        userLoading,
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