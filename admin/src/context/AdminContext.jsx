import React, { createContext } from 'react';
import { useState } from 'react';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState('');
    const BackendUrl = import.meta.env.VITE_BACKEND_URL;

    const value = {

        aToken, setAToken, BackendUrl

    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}


export default AdminContextProvider;

