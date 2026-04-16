import axios from 'axios';
import React, { use, useEffect, useContext, useState } from 'react';
import { AppContext } from '../component/CreateContext';
import { Images } from '../assets/img';

function Appointment() {

    const { BackendUrl, user, token } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [updateAppointments, setUpdatedAppointments] = useState([]);

     
    ///check the user is login or not
    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        }
    })



    /// format  Convert "Wed,4/22/2026" → "2026-04-22"
    const formatToISO = (dateStr) => {
        if (!dateStr) return "";

        const cleanDate = dateStr.split(",")[1]; // "4/22/2026"
        const date = new Date(cleanDate); 

        const year = date.getFullYear();
        // in case month or day is single digit, we need to pad it with 0
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
        const day = String(date.getDate()).padStart(2, "0");


        return `${year}-${month}-${day}`;
    };


    //fetch the appointment data for the patient
    useEffect(() => {
        if (!user?.email) return;
        const userId = user?.email;
        const feach = async () => {
            try {
                const res = await axios.get(`${BackendUrl}/api/patient/appointment/patient`, {
                    params: { patientEmail: userId },
                });

                if (!res.data.success) {
                    return console.log(res.data.message);
                }
                setAppointments(res.data.appointments);
               

            } catch (error) {
                console.log(error?.response?.data?.message || error.message);
            }
        }
        feach();
    }, [BackendUrl, user]);


    //get the status of the appointment
    const getStatus = (input) => {
        const today = new Date();
        const appointmentDate = new Date(input);
        console.log(appointmentDate);

        today.setHours(0, 0, 0, 0);
        if (appointmentDate < today) {
            return 'Completed';
        } else if (appointmentDate > today) {
            return 'Upcoming';
        }

        return 'Today';
    }



    ///processed get Satatus + filter + search + sort
    useEffect(() => {
        const processedAppointments = appointments.map((item) => ({
            ...item,
            appointmentStatus: getStatus(formatToISO(item.appointmentDate))
        })).filter((item) => {
            return item.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
        }).sort((a, b) => new Date(formatToISO(b.appointmentDate)) - new Date(formatToISO(a.appointmentDate)));
        setUpdatedAppointments(processedAppointments);
        console.log(processedAppointments);
    }, [appointments, searchTerm])


    return (
        <>


            <div className='flex justify-between px-4'>
                <h1>My Appointments</h1>
                <div className='bg-(--color-input) border border-gray-200 focus:outline-none px-2 py-1 flex items-center gap-1.5 rounded-md'>
                    <i className="bi bi-search text-gray-300"></i>
                    <input type="text" className='focus:outline-none py-1' placeholder='Search Doctor' onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            {
                updateAppointments.length > 0 ? (

                    <div className='w-full'>
                        <p className='text-sm mx-auto'>Appointment: {updateAppointments.length}</p>
                        <ul className='h-[calc(100vh-120px)] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 px-2'>
                            {updateAppointments.map((items, index) => {
                                return (
                                    <li key={index} className='border p-2 border-gray-200 relative rounded-md flex flex-col gap-1'>
                                        <p className={`${items.appointmentStatus === 'Completed' ? 'bg-red-100 text-red-800' : items.appointmentStatus === 'Upcoming' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} px-2 w-fit rounded-full text-sm absolute top-2 right-2`}>{items.appointmentStatus}</p>
                                        <p>Doctor: {items.doctorName}</p>
                                        <p><i className="bi bi-calendar"></i> {items.appointmentDate}</p>
                                        <p><i className="bi bi-clock"></i> {items.appointmentTime}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                ) : (
                    <div className='w-full h-[calc(100vh-120px)] mx-auto flex flex-col items-center justify-center'>
                        <img src={Images.NoAppointment} alt="No Appointments" className='w-70' />
                        <p className='w-fit mx-auto '>You have no appointments.</p>
                    </div>
                )
            }
        </>
    )
}

export default Appointment