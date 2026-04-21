import axios from 'axios';
import React, { use, useEffect, useContext, useState } from 'react';
import { AppContext } from '../component/CreateContext';
import { Images } from '../assets/img';
import { useNavigate } from 'react-router-dom';
import Reschedule from './Reschedule';

function Appointment() {
    const navigate = useNavigate();

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


        today.setHours(0, 0, 0, 0);
        if (appointmentDate < today) {
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


    return (
        <>

            <section className='h-[calc(100vh-120px)]'>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 xl:px-10 py-4">

                    {/* Left Section */}
                    <div className="space-y-1">
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                            My Appointments
                        </h1>

                        <p className="text-sm flex items-center text-gray-600 flex-wrap">
                            <span
                                className={`${filter ? "bg-green-500" : "bg-red-400"
                                    } w-2.5 h-2.5 rounded-full mr-2`}
                            ></span>

                            <span>
                                You have{" "}
                                <span className="font-medium">
                                    {filter
                                        ? upcomingAppointments.length
                                        : pastAppointments.length}
                                </span>
                            </span>

                            <span
                                className={`${filter ? "text-green-600" : "text-red-500"
                                    } ml-1 font-medium`}
                            >
                                {filter ? "Upcoming" : "Completed"}
                            </span>

                            <span className="ml-1">Appointments</span>
                        </p>
                    </div>

                    {/* Right Section (Search) */}
                    <div className="w-full md:w-auto">
                        <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition">

                            <i className="bi bi-search text-gray-400 mr-2"></i>

                            <input
                                type="text"
                                placeholder="Search Doctor"
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent outline-none text-sm w-full md:w-48 placeholder-gray-400"
                            />
                        </div>
                    </div>

                </div>
                {
                    updateAppointments.length > 0 ? (

                        <div className="w-full px-4 md:py-6">

                            {/* Filter Tabs */}
                            <div className="flex gap-2 bg-gray-100 w-fit p-1 rounded-lg mt-2">
                                <button
                                    onClick={() => setFilter(true)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition cursor-pointer
            ${filter
                                            ? "bg-(--color-primary) text-white shadow-sm"
                                            : "text-gray-600 hover:text-black"
                                        }`}
                                >
                                    Upcoming
                                </button>

                                <button
                                    onClick={() => setFilter(false)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition cursor-pointer
            ${!filter
                                            ? "bg-(--color-primary) text-white shadow-sm"
                                            : "text-gray-600 hover:text-black"
                                        }`}
                                >
                                    Completed
                                </button>
                            </div>

                            {/* Cards */}
                            <ul className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-6 max-w-[1400px]">
                                {filteredAppointments.map((items, index) => {

                                    const statusStyle =
                                        items.appointmentStatus === "Completed"
                                            ? "bg-red-100 text-red-700"
                                            : items.appointmentStatus === "Upcoming"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700";

                                    return (
                                        <li
                                            key={index}
                                            className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 relative shadow-sm hover:shadow-md transition"
                                        >

                                            {/* Status Badge */}
                                            <span className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full ${statusStyle}`}>
                                                {items.appointmentStatus}
                                            </span>

                                            {/* Image */}
                                            <img
                                                src={items.image}
                                                alt="doctor"
                                                className="w-24 h-24 object-cover rounded-lg bg-gray-100 my-auto"
                                            />

                                            {/* Content */}
                                            <div className="flex flex-col justify-between flex-1">

                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {items.doctorName}
                                                    </p>

                                                    <p className="text-sm text-gray-500">
                                                        {items.doctorSpeciality}
                                                    </p>

                                                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                                        <p className="flex items-center gap-1">
                                                            <i className="bi bi-calendar text-(--color-primary)"></i>
                                                            {items.appointmentDate}
                                                        </p>

                                                        <p className="flex items-center gap-1">
                                                            <i className="bi bi-clock text-(--color-primary)"></i>
                                                            {items.appointmentTime}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Action */}
                                                {items.appointmentStatus === "Upcoming" && (
                                                    <button
                                                        onClick={() => appointmentReschedule(items.doctorId, items)}
                                                        className="mt-3 w-fit px-4 py-1.5 text-sm rounded-md bg-(--color-primary) text-white hover:opacity-90 transition cursor-pointer"
                                                    >
                                                        Reschedule
                                                    </button>
                                                )}

                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                    ) : (

                        <div className="w-full h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center">
                            <img
                                src={Images.NoAppointment}
                                alt="No Appointments"
                                className="w-64 opacity-80"
                            />
                            <p className="text-gray-500 mt-2">
                                You have no appointments.
                            </p>
                        </div>

                    )
                }
            </section>
        </>
    )
}

export default Appointment