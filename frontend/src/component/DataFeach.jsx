import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import {AppContext} from "./CreateContext";

const BackendUrl = import.meta.env.VITE_BACKEND_URL;

export const useDoctors = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get(`${BackendUrl}/api/doctor/list`);

                if (res.data.success) {
                    setDoctors(res.data.doctorsList);
                }
            } catch (error) {
                console.log(error?.response?.data?.message);
            }
        };

        fetchDoctors();
    }, []);

    return doctors;
};
