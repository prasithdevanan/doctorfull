import axios from 'axios';
import React, { use, useEffect, useContext } from 'react';
import { AppContext } from '../component/CreateContext';

function Appointment() {
    const { BackendUrl, user } = useContext(AppContext);
    console.log(user);
    useEffect(() => {
        const userId = user?.email;
        const feach = async () => {
            try {
                const res = await axios.get(`${BackendUrl}/api/patient/appointment/patient`, {
                    params: { patientEmail: userId },
                });

                if (!res.data.success) {
                    console.log(res.data.message);
                }
                console.log(res.data.appointments);

            } catch (error) {
                console.log(error?.response?.data?.message || error.message);
            }
        }
        feach();
    }, [BackendUrl, user]);

  return (
    <div>Appointment</div>
  )
}

export default Appointment