import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "./CreateContext";

const BackendUrl = import.meta.env.VITE_BACKEND_URL;

export const useDoctors = () => {
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState(loading ? "Loading" : []);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${BackendUrl}/api/doctor/list`);

                if (res.data.success) {
                    setDoctors(res.data.doctorsList);
                }
            } catch (error) {
                console.log(error?.response?.data?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    return doctors;
};
