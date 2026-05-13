import axios from 'axios';
import React, { use, useEffect, useContext, useState } from 'react';
import { AppContext } from '../component/CreateContext';
import { Images } from '../assets/img';
import { useNavigate } from 'react-router-dom';
import Reschedule from './Reschedule';
import {toast} from 'react-toastify';

function Appointment() {
    const navigate = useNavigate();

    const { BackendUrl, user, token } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [updateAppointments, setUpdatedAppointments] = useState([]);
    const [popup, setPopup] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);


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
                    return toast.error(res.data.message);
                }
                setAppointments(res.data.appointments);


            } catch (error) {
                toast.error(error?.response?.data?.message);
            }
        }
        feach();
    }, [BackendUrl, user]);


    //get the status of the appointment
    const getStatus = (input) => {
        const today = new Date();
        const appointmentDate = new Date(input);


        today.setHours(0, 0, 0, 0);
        if (appointmentDate === today) {
            return 'Today';
        } else if (appointmentDate < today) {
            return 'Completed';
        } else if (appointmentDate > today) {
            return 'Upcoming';
        }

        return 'Today';
    }

    const appointmentReschedule = (id, item) => {
        navigate(`/appointment/${id}/reschedule`, { state: { appointment: item } });
    }



    ///processed get Satatus + filter + search + sort
    useEffect(() => {
        const processedAppointments = appointments.map((item) => ({
            ...item,
            appointmentStatus: getStatus(formatToISO(item.appointmentDate))
        })).filter((item) => {
            return item.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
        }).sort((a, b) => new Date(formatToISO(a.appointmentDate)) - new Date(formatToISO(b.appointmentDate)));
        setUpdatedAppointments(processedAppointments);

    }, [appointments, searchTerm])

    const [filter, setFilter] = useState(true);
    const upcomingAppointments = updateAppointments.filter((item) => item.appointmentStatus === 'Upcoming');
    const pastAppointments = updateAppointments.filter((item) => item.appointmentStatus === 'Completed');
    const filteredAppointments = filter ? upcomingAppointments : pastAppointments;


    const handleDeleteClick = (items) => {
        setSelectedUser(items);
        setPopup(true);
    }

    const confirmDelete = async () => {
        const data = new Date().toLocaleDateString();
        const appoitmentData = (selectedUser.appointmentDate).split(",")[1];
       
        if (data === appoitmentData) {
            alert("You can't cancel the appointment on the day of the appointment");
            return;
        }
        const deleteUpdate = updateAppointments.filter((item) => selectedUser._id !== item._id);
        setUpdatedAppointments(deleteUpdate);
        try {
            const res = await axios.delete(`${BackendUrl}/api/patient/appointment/delete/${selectedUser._id}`);
            if (!res.data.success) {
                return toast.error(res.data.message);
            }
            toast.success(res.data.message);
        } catch (error) {
           toast.error(error?.response?.data?.message);
        } finally {
            setPopup(false);
        }
    }


    return (
        <>
            <section className="h-[calc(100vh-120px)] bg-gray-50">

                {popup && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]" onClick={() => setPopup(false)}>
                        <div className="bg-white rounded-2xl shadow-lg w-[320px] p-6 text-center" onClick={(e) => e.stopPropagation()}>
                            <span className="p-3 px-4 bg-red-100 rounded-lg inline-flex"><i className="bi bi-trash3 text-red-600"></i></span>
                            <p className="text-sm text-gray-700 mt-4 mb-6">Are you sure you want to cancel this appointment?</p>
                            <div className="flex justify-center gap-3">
                                <button className="px-4 py-2 text-sm bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 transition" onClick={() => setPopup(false)}>No</button>
                                <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 transition" onClick={confirmDelete}>Yes</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 lg:px-10 py-5">

                    <div className="space-y-1">
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">My Appointments</h1>
                        <p className="text-sm flex items-center text-gray-600 flex-wrap">
                            <span className={`${filter ? "bg-green-500" : "bg-red-400"} w-2.5 h-2.5 rounded-full mr-2`}></span>
                            <span>You have <span className="font-medium">{filter ? upcomingAppointments.length : pastAppointments.length}</span></span>
                            <span className={`${filter ? "text-green-600" : "text-red-500"} ml-1 font-medium`}>{filter ? "Upcoming" : "Completed"}</span>
                            <span className="ml-1">Appointments</span>
                        </p>
                    </div>

                    <div className="w-full md:w-auto">
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-(--color-primary) transition">
                            <i className="bi bi-search text-gray-400 mr-2"></i>
                            <input type="text" placeholder="Search Doctor" onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent outline-none text-sm w-full md:w-56 placeholder-gray-400" />
                        </div>
                    </div>

                </div>

                {updateAppointments.length > 0 ? (

                    <div className="w-full px-4 lg:px-10 py-6">

                        <div className="flex gap-2 bg-white border border-gray-200 w-fit p-1 rounded-xl">
                            <button onClick={() => setFilter(true)} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${filter ? "bg-(--color-primary) text-white" : "text-gray-600"}`}>Upcoming</button>
                            <button onClick={() => setFilter(false)} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${!filter ? "bg-(--color-primary) text-white" : "text-gray-600"}`}>Completed</button>
                        </div>

                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 py-6 max-w-[1400px] mx-auto">

                            {filteredAppointments.map((items, index) => {

                                const statusStyle = items.appointmentStatus === "Completed" ? "bg-[#10B981]/10 text-[#10B981]" : items.status === "Accepted" ? "bg-green-100 text-green-700" : items.status === "Rescheduled" ? "bg-[#3B82F6]/10 text-[#3B82F6]" : items.status === "Reject" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700";

                                // ------- map the appoitments ------------
                                return (
                                    <li key={index} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 relative shadow-sm">

                                        <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${statusStyle}`}>{items.appointmentStatus === "Upcoming" ? items.status : items.appointmentStatus}</span>

                                        <img src={items.image} alt="doctor" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-gray-100" />

                                        <div className="flex flex-col justify-between flex-1">

                                            <div>
                                                <p className="font-semibold text-gray-800">{items.doctorName}</p>
                                                <p className="text-sm text-gray-500">{items.doctorSpeciality}</p>

                                                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                                                    <p className="flex items-center gap-1"><i className="bi bi-calendar text-(--color-primary)"></i>{items.appointmentDate}</p>
                                                    <p className="flex items-center gap-1"><i className="bi bi-clock text-(--color-primary)"></i>{items.appointmentTime}</p>
                                                </div>
                                            </div>

                                            {items.appointmentStatus === "Upcoming" && (
                                                <div className="flex justify-between items-center mt-3">
                                                    <button onClick={() => appointmentReschedule(items.doctorId, items)} className="px-4 py-2 text-sm rounded-lg bg-(--color-primary) text-white cursor-pointer">Reschedule</button>
                                                    <button onClick={() => handleDeleteClick(items)} className="text-sm text-red-500 p-2 px-3 bg-red-100 rounded-lg cursor-pointer"><i className="bi bi-trash3"></i></button>
                                                </div>
                                            )}

                                        </div>

                                    </li>
                                );
                            })}

                        </ul>

                    </div>

                ) : (

                    <div className="w-full h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center px-4">
                        <img src={Images.NoAppointment} alt="No Appointments" className="w-52 sm:w-64 opacity-80" />
                        <p className="text-gray-500 mt-3 text-sm">You have no appointments.</p>
                    </div>

                )}

            </section>
        </>
    )
}

export default Appointment