import React, { useState, useContext } from 'react'
import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../component/Button';
import TextAnimation from '../component/TextAnimation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../component/CreateContext';
import { socket } from '../socket/socket';

function DoctorBooking() {
    const { BackendUrl } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();
    const element = location.state ? location.state.element : false;
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedTimeslot, setSelectedTimeslot] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [onlineStatus, setOnlineStatus] = useState(false);
    ///select the time and date
    const [selectDate, setSelectDate] = useState(null);
    const [selectTime, setSelectTime] = useState(null);

    const dates = [];
    const baseDate = new Date();

    //-------------------------Date calcualte------------------------
    for (let i = 1; i <= 11; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);

        const day = date.toLocaleDateString("en-US", { weekday: 'short' });
        const dayNumber = date.getDate();

        dates.push({
            day: day,
            date: dayNumber,
            fulldate: date.toLocaleDateString('en-US')
        });
    }

    //------check the screen from the previous-----------
    useEffect(() => {
        if (!location.state?.fromBooking) {
            navigate('/doctor');
        }
    }, []);


    //------------slot calculation-----------------------

    const generateTimeSlot = () => {
        const slots = [];

        const addSlot = (start, end) => {
            for (let hour = start; hour <= end; hour++) {
                slots.push(`${hour}:00`);
            }
        };

        addSlot(8, 12);

        addSlot(1, 6);

        return slots;
    }

    const timeSlots = generateTimeSlot();

    //-------------------------fetch the booked slot for the doctor------------------------

    useEffect(() => {
        if (!selectDate) return;
        const dateFormate = selectDate.day + "," + selectDate.fulldate;
        const featchBookedSlots = async () => {
            try {
                const res = await axios.get(`${BackendUrl}/api/patient/appointment/timeslot`, {
                    params: {
                        doctorId: element._id,
                        appointmentDate: dateFormate
                    }
                });

                if (res.data.success) {
                    setBookedSlots(res.data.bookedSlots);
                }

            } catch (error) {
                toast.error('Failed to fetch booked slots. Please try again later.');
            }
        }
        featchBookedSlots();
    }, [selectDate]);


    //check the user login or not
    useEffect(() => {
        const handleOnlineStatus = ({ userId, isOnline }) => {
            if (userId === element._id) {
                setOnlineStatus(isOnline);
            }
        };

        socket.on("onlineStatus", handleOnlineStatus);

        return () => {
            socket.off("onlineStatus", handleOnlineStatus);
        };
    }, [element._id]);

    //check the user is online or not
    useEffect(() => {
        socket.emit("checkOnline", {
            userId: element._id
        });
    }, [element._id]);


    return (
        <>
            <div className="min-h-[calc(100vh-72px)] overflow-x-hidden bg-slate-50">

                <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-4 sm:py-4 md:px-6 lg:h-[calc(100vh-72px)] lg:px-4 lg:py-5">

                    <div className="grid w-full grid-cols-1 gap-4 md:gap-5 lg:h-full lg:min-h-0 lg:grid-cols-[280px_minmax(0,1fr)] ">

                        {/* DOCTOR PROFILE */}

                        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm sm:rounded-[1.75rem] sm:p-4 lg:min-h-0 lg:overflow-y-auto lg:p-4 no-scrollbar relative">

                            <div className="flex flex-col gap-4 h-full">

                                {/* Doctor Image */}
                                <div className="group relative mx-auto shrink-0 overflow-hidden rounded-[1.5rem] bg-slate-100 w-full aspect-[4/3] max-w-[400px] sm:rounded-[1.75rem] lg:aspect-auto">

                                    <img
                                        src={element.image}
                                        alt={element.name}
                                        className="h-full w-full object-contain object-fit transition-transform duration-500 group-hover:scale-105"
                                    />

                                    {/* Online Status */}
                                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">

                                        <span className={`h-2 w-2 rounded-full ${onlineStatus ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-slate-400"}`} />

                                        {onlineStatus ? "Online" : "Offline"}

                                    </div>

                                </div>


                                {/* Doctor Details */}
                                <div className="flex flex-col">

                                    {/* Status */}
                                    <div className="mb-2.5 flex items-center justify-between gap-2">

                                        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                            Doctor Profile
                                        </span>

                                        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold ${element.available ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                                            {element.available ? "Available" : "Unavailable"}
                                        </span>

                                    </div>


                                    {/* Name */}
                                    <div className="space-y-1">

                                        <TextAnimation
                                            text={element.name}
                                            className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
                                            icon={<i className="bi bi-patch-check-fill text-xs text-blue-500" />}
                                        />

                                        <div className="flex flex-wrap items-center gap-1.5">

                                            <p className="text-xs font-medium text-slate-600 sm:text-sm">
                                                {element.speciality}
                                            </p>

                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-500">
                                                {element.experience}
                                            </span>

                                        </div>

                                    </div>


                                    {/* About */}
                                    <div className="mt-3">

                                        <div className="mb-1 flex items-center gap-1.5">

                                            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-slate-800">
                                                About
                                            </h2>

                                            <i className="bi bi-info-circle text-[10px] text-slate-400" />

                                        </div>

                                        <p className="line-clamp-3 text-xs leading-5 text-slate-500">
                                            {element.about}
                                        </p>

                                    </div>


                                    {/* Fee */}
                                    <div className="absolute bottom-4 left-0 right-0 px-3 hidden lg:block">

                                        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">

                                            <div>

                                                <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
                                                    Consultation
                                                </span>

                                                <p className="text-[10px] text-slate-500">
                                                    Per session
                                                </p>

                                            </div>

                                            <span className="text-lg font-bold text-emerald-600">
                                                ₹{element.fees}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* BOOKING */}

                        <section className="flex min-w-0 flex-col rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[1.75rem] sm:p-5 md:p-6 lg:min-h-0">

                            <div className="flex min-h-0 flex-1 flex-col">

                                {/* Header */}
                                <div className="shrink-0">

                                    <div className="flex items-center justify-between gap-3">

                                        <div>

                                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-500 sm:text-xs">
                                                Appointment
                                            </p>

                                            <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                                Book your consultation
                                            </h1>

                                            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                                Choose a convenient date and available time.
                                            </p>

                                        </div>

                                        {selectTime && (
                                            <div className="hidden shrink-0 rounded-xl bg-blue-50 px-3 py-2 sm:block">

                                                <p className="text-[9px] uppercase tracking-wider text-blue-400">
                                                    Selected
                                                </p>

                                                <p className="text-xs font-semibold text-blue-600">
                                                    {selectTime}
                                                </p>

                                            </div>
                                        )}

                                    </div>

                                </div>


                                {/* DATE */}

                                <div className="mt-5 shrink-0">

                                    <div className="mb-2 flex items-center justify-between">

                                        <h2 className="text-sm font-semibold text-slate-800">
                                            Select Date
                                        </h2>

                                        {selectDate && (
                                            <span className="text-[10px] font-medium text-blue-600 sm:text-xs">
                                                {selectDate.day}
                                            </span>
                                        )}

                                    </div>


                                    <div className="w-full overflow-x-auto no-scrollbar">

                                        <div className="flex min-w-max gap-2.5 pb-1">

                                            {dates.map((item, index) => {

                                                const isSelected = selectedIndex === index;

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            setSelectedIndex(index);
                                                            setSelectDate(item);
                                                            setSelectedTimeslot(null);
                                                            setSelectTime(null);
                                                        }}
                                                        className={`flex min-w-[72px] cursor-pointer flex-col items-center justify-center rounded-xl border px-3 py-2.5 transition-all duration-200 sm:min-w-[82px] sm:py-3 ${isSelected ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-200" : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/40"}`}
                                                    >

                                                        <span className="text-xs font-semibold sm:text-sm">
                                                            {item.day}
                                                        </span>

                                                        <span className={`mt-1 text-[10px] sm:text-xs ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                                                            {item.date}
                                                        </span>

                                                    </button>
                                                );

                                            })}

                                        </div>

                                    </div>

                                </div>


                                {/* TIME */}

                                <div className="mt-5 flex min-h-[220px] flex-1 flex-col lg:min-h-0">

                                    <div className="mb-2 flex shrink-0 items-center justify-between">

                                        <h2 className="text-sm font-semibold text-slate-800">
                                            Available Time
                                        </h2>

                                        {selectedTimeslot !== null && (
                                            <span className="text-xs font-medium text-blue-600">
                                                {selectTime}
                                            </span>
                                        )}

                                    </div>


                                    {selectedIndex === null ? (

                                        <div className="flex min-h-[100px] flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">

                                            <div className="px-4 text-center">

                                                <i className="bi bi-calendar2-week text-2xl text-slate-300 sm:text-3xl" />

                                                <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                                                    Select a date to view available times
                                                </p>

                                            </div>


                                        </div>

                                    ) : (

                                        <div className="flex-1 pr-1 no-scrollbar h-fit overflow-y-auto py-4">

                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                                                {timeSlots.map((item, index) => {
                                                    const isBooked = bookedSlots.includes(item);
                                                    const isSelected = selectedTimeslot === index;

                                                    return (
                                                        <button
                                                            key={`${item}-${index}`}
                                                            type="button"
                                                            disabled={isBooked}
                                                            onClick={() => {
                                                                if (isBooked) return;

                                                                setSelectedTimeslot(index);
                                                                setSelectTime(item);
                                                            }}
                                                            className={`relative flex h-[48px] w-full items-center justify-center rounded-xl border px-2 text-center transition-all duration-200
        ${isBooked
                                                                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                                                                    : isSelected
                                                                        ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-200"
                                                                        : "cursor-pointer border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/40"
                                                                }`}
                                                        >
                                                            {isBooked && (
                                                                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white bg-rose-100 px-2 py-0.5 text-[9px] font-semibold leading-none text-rose-600 shadow-sm">
                                                                    Booked
                                                                </span>
                                                            )}

                                                            <span
                                                                className={`text-xs font-medium transition-transform sm:text-sm ${isBooked ? "translate-y-1.5" : ""
                                                                    }`}
                                                            >
                                                                {item}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                        </div>

                                    )}

                                </div>


                                {/* FOOTER */}

                                <div className="mt-4 shrink-0 border-t border-slate-100 pt-4">

                                    <div className="flex items-center justify-between gap-3">

                                        {/* Fee */}
                                        <div className="min-w-0">

                                            <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
                                                Consultation Fee
                                            </p>

                                            <p className="text-xl font-bold text-slate-900 sm:text-2xl">
                                                ₹{element.fees}
                                            </p>

                                        </div>


                                        {/* Book Button */}
                                        <Link
                                            to={selectedTimeslot !== null ? `/doctor/${element._id}/patientdetails` : "#"}
                                            state={{
                                                element,
                                                fromBooking: true,
                                                selectDate,
                                                selectTime,
                                            }}
                                            onClick={(e) => {
                                                if (selectedTimeslot === null) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="shrink-0"
                                        >

                                            <Button
                                                children={selectedTimeslot !== null ? "Book Appointment" : "Select Time"}
                                                icon={<i className="bi bi-arrow-right-short text-xl" />}
                                                primary={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 sm:px-5 sm:py-3 sm:text-sm ${selectedTimeslot !== null ? "bg-[var(--color-primary)] text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg cursor-pointer" : "cursor-not-allowed bg-slate-100 text-slate-400"}`}
                                            />

                                        </Link>

                                    </div>

                                </div>

                            </div>

                        </section>

                    </div>

                </div>

            </div>

        </>
    )
}

export default DoctorBooking;