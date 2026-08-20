import axios from 'axios';
import React, { use, useEffect, useContext, useState } from 'react';
import { AppContext } from '../component/CreateContext';
import { Images } from '../assets/img';
import { useNavigate } from 'react-router-dom';
import Reschedule from './Reschedule';
import { toast } from 'react-toastify';
import { socket } from '../socket/socket';

function Appointment() {
    const navigate = useNavigate();

    const { BackendUrl, user, token } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [updateAppointments, setUpdatedAppointments] = useState([]);
    const [popup, setPopup] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // useEffect(() => {

    //     socket.emit("user_appointment_delete", { appointmentId: "6a2b97f28c0bf573a3627c80" });
    // }, [])

    ///check the user is login or not
    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        }
    });



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
        console.log(processedAppointments);
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
            socket.emit("user_appointment_delete", { appointmentId: selectedUser._id, doctorId: selectedUser.doctorId });
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

    const clickevent = (items) => {
        console.log(items);
        navigate(`/appointment/${items._id}`, { state: items });
    }


    return (
        <>
            <section className="min-h-[calc(100vh-90px)] bg-slate-50">

                {/* ================= DELETE MODAL ================= */}
                {popup && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4" onClick={() => setPopup(false)}>

                        <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-100 p-6" onClick={(e) => e.stopPropagation()}>

                            <div className="flex justify-center">
                                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                                    <i className="bi bi-calendar-x text-xl text-red-500"></i>
                                </div>
                            </div>

                            <div className="text-center mt-4">
                                <h3 className="text-base font-semibold text-slate-800">
                                    Cancel Appointment?
                                </h3>

                                <p className="text-sm text-slate-500 leading-6 mt-2">
                                    Are you sure you want to cancel this appointment?
                                    This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex gap-3 mt-6">

                                <button
                                    onClick={() => setPopup(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                                >
                                    Keep Appointment
                                </button>

                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition cursor-pointer"
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>
                )}


                {/* ================= HEADER ================= */}
                <div className="px-4 sm:px-6 lg:px-10 py-6 bg-white border-b border-slate-200">

                    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                        {/* PAGE TITLE */}
                        <div>

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-xl bg-(--color-primary)/10 flex items-center justify-center">
                                    <i className="bi bi-calendar2-check text-(--color-primary)"></i>
                                </div>

                                <div>
                                    <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
                                        My Appointments
                                    </h1>

                                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                        Manage and track your healthcare appointments
                                    </p>
                                </div>

                            </div>


                            {/* APPOINTMENT COUNT */}
                            <div className="flex items-center gap-2 mt-4">

                                <span className={`w-2 h-2 rounded-full ${filter ? "bg-emerald-500" : "bg-slate-400"}`}></span>

                                <span className="text-sm text-slate-500">
                                    You have
                                </span>

                                <span className="text-sm font-semibold text-slate-700">
                                    {filter ? upcomingAppointments.length : pastAppointments.length}
                                </span>

                                <span className={`text-sm font-medium ${filter ? "text-emerald-600" : "text-slate-500"}`}>
                                    {filter ? "Upcoming" : "Completed"}
                                </span>

                                <span className="text-sm text-slate-500">
                                    appointments
                                </span>

                            </div>

                        </div>


                        {/* SEARCH */}
                        <div className="w-full lg:w-auto">

                            <div className="flex items-center w-full lg:w-80 h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:bg-white focus-within:border-(--color-primary) focus-within:ring-4 focus-within:ring-(--color-primary)/10 transition">

                                <i className="bi bi-search text-slate-400"></i>

                                <input
                                    type="text"
                                    placeholder="Search doctor..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-transparent outline-none px-3 text-sm text-slate-700 placeholder:text-slate-400"
                                />

                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        <i className="bi bi-x-circle"></i>
                                    </button>
                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= APPOINTMENT CONTENT ================= */}
                {updateAppointments.length > 0 ? (

                    <div className="px-4 sm:px-6 lg:px-10 py-6">

                        <div className="max-w-[1400px] mx-auto">


                            {/* ================= TABS ================= */}
                            <div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl">

                                <button
                                    onClick={() => setFilter(true)}
                                    className={`px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-2 ${filter ? "bg-(--color-primary) text-white" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
                                >
                                    <i className="bi bi-calendar-event"></i>
                                    Upcoming
                                </button>

                                <button
                                    onClick={() => setFilter(false)}
                                    className={`px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-2 ${!filter ? "bg-(--color-primary) text-white" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
                                >
                                    <i className="bi bi-calendar-check"></i>
                                    Completed
                                </button>

                            </div>


                            {/* ================= APPOINTMENT LIST ================= */}
                            {filteredAppointments.length > 0 ? (

                                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">

                                    {filteredAppointments.map((items, index) => {

                                        const statusStyle =
                                            items.appointmentStatus === "Completed"
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                : items.status === "Accepted"
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    : items.status === "Rescheduled"
                                                        ? "bg-blue-50 text-blue-600 border-blue-100"
                                                        : items.status === "Reject"
                                                            ? "bg-red-50 text-red-600 border-red-100"
                                                            : "bg-amber-50 text-amber-600 border-amber-100";


                                        return (

                                            <li
                                                key={index}
                                                onClick={() => clickevent(items)}
                                                className="group bg-white border border-slate-200 rounded-2xl p-5 transition duration-200 hover:border-slate-300 cursor-pointer"
                                            >


                                                {/* ================= CARD HEADER ================= */}
                                                <div className="flex items-start justify-between gap-3">

                                                    {/* PATIENT */}
                                                    <div className="flex items-center gap-3 min-w-0">

                                                        <img
                                                            src={items.image}
                                                            alt="doctor"
                                                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0"
                                                        />

                                                        <div className="min-w-0">

                                                            <p className="font-semibold text-slate-800 truncate">
                                                                {items.patientName}
                                                            </p>

                                                            <p
                                                                className="text-xs text-slate-500 mt-1 truncate"
                                                                title={items.reason}
                                                            >
                                                                {items.reason.length > 25
                                                                    ? items.reason.slice(0, 25) + "..."
                                                                    : items.reason}
                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* STATUS */}
                                                    <span className={`shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full border ${statusStyle}`}>
                                                        {items.appointmentStatus === "Upcoming"
                                                            ? items.status
                                                            : items.appointmentStatus}
                                                    </span>

                                                </div>


                                                {/* ================= DATE & TIME ================= */}
                                                <div className="grid grid-cols-2 gap-3 mt-5">


                                                    {/* DATE */}
                                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">

                                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                                            <i className="bi bi-calendar3"></i>
                                                            Date
                                                        </div>

                                                        <p className="text-sm font-medium text-slate-700 mt-1">
                                                            {items.appointmentDate}
                                                        </p>

                                                    </div>


                                                    {/* TIME */}
                                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">

                                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                                            <i className="bi bi-clock"></i>
                                                            Time
                                                        </div>

                                                        <p className="text-sm font-medium text-slate-700 mt-1">
                                                            {items.appointmentTime}
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* ================= DOCTOR DETAILS ================= */}
                                                <div className="mt-4 pt-4 border-t border-slate-100">


                                                    {/* DOCTOR */}
                                                    <div className="flex items-center gap-2 min-w-0">

                                                        <div className="w-7 h-7 rounded-lg bg-(--color-primary)/10 flex items-center justify-center shrink-0">
                                                            <i className="bi bi-person-badge text-(--color-primary) text-xs"></i>
                                                        </div>

                                                        <span className="text-xs text-slate-400">
                                                            Doctor
                                                        </span>

                                                        <span className="text-sm font-medium text-slate-700 truncate">
                                                            {items.doctorName}
                                                        </span>

                                                    </div>


                                                    {/* SPECIALTY */}
                                                    <div className="flex items-center gap-2 mt-2 min-w-0">

                                                        <div className="w-7 h-7 rounded-lg bg-(--color-primary)/10 flex items-center justify-center shrink-0">
                                                            <i className="bi bi-heart-pulse text-(--color-primary) text-xs"></i>
                                                        </div>

                                                        <span className="text-xs text-slate-400">
                                                            Specialty
                                                        </span>

                                                        <span className="text-sm font-medium text-slate-700 truncate">
                                                            {items.doctorSpeciality}
                                                        </span>

                                                    </div>

                                                </div>


                                                {/* ================= ACTIONS ================= */}
                                                {items.appointmentStatus === "Upcoming" && (

                                                    <div className="flex gap-2 mt-5">


                                                        {/* VIEW APPOINTMENT */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                clickevent(items);
                                                            }}
                                                            className="flex-1 h-10 rounded-xl bg-(--color-primary) hover:bg-(--color-primary)/90 text-white text-sm font-medium transition cursor-pointer flex items-center justify-center gap-2"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                            <span>View Appointment</span>
                                                        </button>


                                                        {/* RESCHEDULE */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                appointmentReschedule(items.doctorId, items);
                                                            }}
                                                            className="h-10 px-3 sm:px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition cursor-pointer flex items-center justify-center gap-2"
                                                        >
                                                            <i className="bi bi-calendar2-event"></i>
                                                            <span className="hidden sm:inline">
                                                                Reschedule
                                                            </span>
                                                        </button>


                                                        {/* CANCEL */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClick(items);
                                                            }}
                                                            className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition cursor-pointer flex items-center justify-center shrink-0"
                                                            aria-label="Cancel appointment"
                                                        >
                                                            <i className="bi bi-trash3"></i>
                                                        </button>

                                                    </div>

                                                )}


                                                {/* ================= COMPLETED ACTION ================= */}
                                                {items.appointmentStatus === "Completed" && (

                                                    <div className="mt-5">

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                clickevent(items);
                                                            }}
                                                            className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition cursor-pointer flex items-center justify-center gap-2"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                            View Appointment
                                                        </button>

                                                    </div>

                                                )}

                                            </li>

                                        );

                                    })}

                                </ul>

                            ) : (


                                /* ================= FILTER EMPTY STATE ================= */
                                <div className="min-h-[calc(100vh-330px)] flex flex-col items-center justify-center text-center px-4">

                                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                                        <i className="bi bi-calendar-x text-3xl text-slate-400"></i>
                                    </div>

                                    <h3 className="text-base font-semibold text-slate-700">
                                        No {filter ? "upcoming" : "completed"} appointments
                                    </h3>

                                    <p className="text-sm text-slate-400 mt-1 max-w-sm">
                                        {filter
                                            ? "You don't have any upcoming appointments scheduled."
                                            : "Your completed appointments will appear here."
                                        }
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                ) : (


                    /* ================= NO APPOINTMENTS ================= */
                    <div className="min-h-[calc(100vh-300px)] flex flex-col items-center justify-center text-center px-4">

                        <div className="w-24 h-24 rounded-3xl bg-(--color-primary)/10 flex items-center justify-center mb-5">
                            <i className="bi bi-calendar2-x text-4xl text-(--color-primary)"></i>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-700">
                            No appointments yet
                        </h3>

                        <p className="text-sm text-slate-400 mt-2 max-w-sm">
                            You currently don't have any appointments.
                            Your scheduled visits will appear here.
                        </p>

                    </div>

                )}

            </section>
        </>
    )
}

export default Appointment