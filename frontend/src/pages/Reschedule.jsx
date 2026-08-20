import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../component/CreateContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';



function Reschedule() {
    const location = useLocation();
    const appointment = location.state?.appointment || null;
    const [selectDate, setSelectDate] = useState(null);
    const [selectTime, setSelectTime] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    const { BackendUrl } = useContext(AppContext);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [currentDate, setCurrentDate] = useState(appointment?.appointmentDate);
    const [popup, setPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const dates = [];
    const baseDate = new Date();

    //---

    useEffect(() => {
        const format = appointment?.appointmentDate;
        setCurrentDate(format);
    }, [appointment]);
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



    //-------------------------Date slote from backend------------------------
    useEffect(() => {
        // if (!currentDate || !selectDate) return toast.error("No date selected");
        const dateFormate = selectDate ? selectDate.day + "," + selectDate.fulldate : currentDate;
        const featchBookedSlots = async () => {
            try {
                const res = await axios.get(`${BackendUrl}/api/patient/appointment/timeslot`, {
                    params: {
                        doctorId: appointment.doctorId,
                        appointmentDate: dateFormate
                    }
                });

                if (res.data.success) {
                    setBookedSlots(res.data.bookedSlots);
                }
                toast.error(res.data.message);

            } catch (error) {
                toast.error('Failed to fetch booked slots. Please try again later.');
            }
        }
        featchBookedSlots();
    }, [selectDate]);


    ///------check the before reschedule the appointment------------------------
    const checkPopup = () => {
        if (!selectDate || !selectTime) {
            return toast.error("Please select both date and time for rescheduling.");
        }
        setPopup(true);
    }




    //-------------------------handle reschedule------------------------
    const handleReschedule = async () => {

        if (!selectDate || !selectTime) {
            return toast.error("Please select both date and time for rescheduling.");
        }

        setLoading(true);
        try {
            const res = await axios.patch(`${BackendUrl}/api/patient/appointment/reschedule/${appointment._id}`, {
                doctorId: appointment.doctorId,
                appointmentDate: selectDate.day + "," + selectDate.fulldate,
                appointmentTime: selectTime,
                status: "Rescheduled"
            });

            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error('Failed to reschedule appointment. Please try again later.');
        } finally {
            setPopup(false);
            setLoading(false);
        }
    }

    const selectedRef = useRef(null);


    ////-------------------------scroll to the selected date------------------------
    useEffect(() => {
        if (selectedRef.current) {
            selectedRef.current.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            });
        }
    }, [selectedIndex, appointment?.appointmentDate]);


    return (
        <>
            <section className="h-[calc(100vh-90px)] bg-slate-50 overflow-y-auto">

                {/* ================= TOP BAR ================= */}
                <header className="h-14 sm:h-16 border-b bg-white border-slate-100 px-4 sm:px-6 lg:px-10 flex items-center shrink-0">

                    <div className="w-full max-w-6xl mx-auto flex items-center justify-between">

                        <Link to="/appointment" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer">
                            <i className="bi bi-arrow-left text-sm"></i>
                            <span>Back</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center">
                                <i className="bi bi-calendar2-event text-sm"></i>
                            </div>
                            <span className="text-sm sm:text-base font-semibold text-slate-800">
                                Reschedule Appointment
                            </span>
                        </div>

                        <div className="w-[80px] sm:w-[100px]"></div>

                    </div>

                </header>


                {/* ================= MAIN ================= */}
                <main className="h-[calc(100%-56px)] sm:h-[calc(100%-64px)] px-3 sm:px-5 lg:px-8 py-3 sm:py-5">

                    <div className="h-full max-w-6xl mx-auto flex flex-col min-h-0">


                     


                        {/* ================= TWO COLUMN LAYOUT ================= */}
                        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-3 sm:gap-4">


                            {/* ===================================================== */}
                            {/* LEFT PANEL */}
                            {/* ===================================================== */}
                            <aside className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col">


                                {/* CURRENT APPOINTMENT */}
                                <div>

                                    <div className="flex items-center gap-2 mb-3">

                                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                                            <i className="bi bi-calendar-x text-sm"></i>
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold text-slate-800">
                                                Current Appointment
                                            </p>

                                            <p className="text-[10px] text-slate-400">
                                                Existing schedule
                                            </p>
                                        </div>

                                    </div>


                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">

                                        <p className="text-[10px] uppercase tracking-wide text-slate-400 font-medium">
                                            Doctor
                                        </p>

                                        <p className="text-sm font-semibold text-slate-800 mt-1 truncate">
                                            {appointment?.doctorName}
                                        </p>


                                        <div className="border-t border-slate-200 my-3"></div>


                                        <div className="flex items-center gap-2">

                                            <i className="bi bi-calendar3 text-(--color-primary) text-xs"></i>

                                            <div>
                                                <p className="text-[9px] text-slate-400">
                                                    Date
                                                </p>

                                                <p className="text-xs font-medium text-slate-700">
                                                    {appointment?.appointmentDate}
                                                </p>
                                            </div>

                                        </div>


                                        <div className="flex items-center gap-2 mt-3">

                                            <i className="bi bi-clock text-(--color-primary) text-xs"></i>

                                            <div>
                                                <p className="text-[9px] text-slate-400">
                                                    Time
                                                </p>

                                                <p className="text-xs font-medium text-slate-700">
                                                    {appointment?.appointmentTime}
                                                </p>
                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* DIVIDER */}
                                <div className="border-t border-slate-100 my-4"></div>


                                {/* NEW APPOINTMENT SUMMARY */}
                                <div className="flex-1 min-h-0">

                                    <div className="flex items-center gap-2 mb-3">

                                        <div className="w-8 h-8 rounded-lg bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center">
                                            <i className="bi bi-calendar2-check text-sm"></i>
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold text-slate-800">
                                                New Appointment
                                            </p>

                                            <p className="text-[10px] text-slate-400">
                                                Your new schedule
                                            </p>
                                        </div>

                                    </div>


                                    {selectTime ? (

                                        <div className="bg-(--color-primary)/5 border border-(--color-primary)/10 rounded-xl p-3">

                                            <div className="flex items-center gap-2">

                                                <div className="w-7 h-7 rounded-lg bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center">
                                                    <i className="bi bi-calendar3 text-xs"></i>
                                                </div>

                                                <div>

                                                    <p className="text-[9px] text-slate-400">
                                                        New Date
                                                    </p>

                                                    <p className="text-xs font-semibold text-slate-700">
                                                        {selectDate?.day}, {selectDate?.fulldate}
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="flex items-center gap-2 mt-3">

                                                <div className="w-7 h-7 rounded-lg bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center">
                                                    <i className="bi bi-clock text-xs"></i>
                                                </div>

                                                <div>

                                                    <p className="text-[9px] text-slate-400">
                                                        New Time
                                                    </p>

                                                    <p className="text-xs font-semibold text-slate-700">
                                                        {selectTime}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    ) : (

                                        <div className="h-24 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-3">

                                            <i className="bi bi-calendar-plus text-lg text-slate-300"></i>

                                            <p className="text-[11px] text-slate-400 mt-1">
                                                Select a date and time
                                            </p>

                                        </div>

                                    )}

                                </div>


                                {/* STATUS */}
                                <div className="mt-4">

                                    <div className="flex items-center gap-2 text-[10px] text-slate-400">

                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        Available

                                        <span className="w-2 h-2 rounded-full bg-slate-300 ml-2"></span>
                                        Booked

                                    </div>

                                </div>

                            </aside>


                            {/* ===================================================== */}
                            {/* RIGHT PANEL */}
                            {/* ===================================================== */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col">


                                {/* DATE HEADER */}
                                <div className="shrink-0 flex items-center justify-between mb-3">

                                    <div>

                                        <h2 className="text-sm sm:text-base font-semibold text-slate-800">
                                            Select Date
                                        </h2>

                                        <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                                            Choose your preferred date
                                        </p>

                                    </div>

                                    <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center">
                                        <i className="bi bi-calendar3 text-sm"></i>
                                    </div>

                                </div>


                                {/* DATE SELECTOR */}
                                <div className="shrink-0 flex gap-2 overflow-x-auto no-scrollbar pb-1">

                                    {dates.map((item, index) => {

                                        const formet = item.day + "," + item.fulldate;

                                        const isSelected =
                                            selectedIndex === index ||
                                            appointment?.appointmentDate === formet;

                                        return (

                                            <button
                                                key={index}
                                                ref={isSelected ? selectedRef : null}
                                                onClick={() => {
                                                    setSelectDate(item);
                                                    setSelectedIndex(index);
                                                    setSelectTime("");
                                                }}
                                                className={`shrink-0 w-[62px] sm:w-[72px] h-[64px] rounded-xl border flex flex-col items-center justify-center transition cursor-pointer ${isSelected ? "bg-(--color-primary) border-(--color-primary) text-white" : "bg-white border-slate-200 text-slate-600 hover:border-(--color-primary) hover:text-(--color-primary)"}`}
                                            >

                                                <span className={`text-[9px] font-medium ${isSelected ? "text-white/75" : "text-slate-400"}`}>
                                                    {item.day}
                                                </span>

                                                <span className="text-base font-semibold mt-0.5">
                                                    {item.date}
                                                </span>

                                            </button>

                                        );

                                    })}

                                </div>


                                {/* DIVIDER */}
                                <div className="border-t border-slate-100 my-4"></div>


                                {/* TIME HEADER */}
                                <div className="shrink-0 flex items-center justify-between mb-3">

                                    <div>

                                        <h2 className="text-sm sm:text-base font-semibold text-slate-800">
                                            Select Time
                                        </h2>

                                        <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                                            Available time slots for the selected date
                                        </p>

                                    </div>

                                    {selectTime && (
                                        <span className="text-[10px] font-medium text-(--color-primary) bg-(--color-primary)/10 px-2 py-1 rounded-full">
                                            {selectTime}
                                        </span>
                                    )}

                                </div>


                                {/* TIME SLOTS */}
                                <div className="flex-1 min-h-0">

                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2">

                                        {timeSlots.map((item, index) => {

                                            const isBooked = bookedSlots.includes(item);
                                            const isSelected = selectTime === item;

                                            return (

                                                <button
                                                    key={index}
                                                    disabled={isBooked}
                                                    onClick={() => {
                                                        if (isBooked) return;
                                                        setSelectTime(item);
                                                    }}
                                                    className={`h-10 sm:h-11 rounded-lg border text-[10px] sm:text-xs font-medium transition cursor-pointer flex items-center justify-center ${isBooked ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed" : isSelected ? "bg-(--color-primary) border-(--color-primary) text-white" : "bg-white border-slate-200 text-slate-600 hover:border-(--color-primary) hover:text-(--color-primary)"}`}
                                                >
                                                    {item}
                                                </button>

                                            );

                                        })}

                                    </div>

                                </div>


                                {/* ACTION AREA */}
                                <div className="shrink-0 pt-4 mt-3 border-t border-slate-100">

                                    {selectTime ? (

                                        <button
                                            onClick={checkPopup}
                                            className="w-full h-11 rounded-xl bg-(--color-primary) hover:bg-(--color-primary)/90 text-white text-sm font-medium transition cursor-pointer flex items-center justify-center gap-2"
                                        >
                                            <i className="bi bi-calendar2-check"></i>
                                            Confirm New Appointment Time
                                        </button>

                                    ) : (

                                        <div className="h-11 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 text-xs sm:text-sm flex items-center justify-center">
                                            Select a time slot to continue
                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                </main>


                {/* ================= CONFIRMATION MODAL ================= */}
                {popup && (

                    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">

                        <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">

                            <div className="flex justify-center">

                                <div className="w-12 h-12 rounded-xl bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center">
                                    <i className="bi bi-calendar2-check text-xl"></i>
                                </div>

                            </div>


                            <div className="text-center mt-4">

                                <h2 className="text-base sm:text-lg font-semibold text-slate-800">
                                    Confirm Reschedule
                                </h2>

                                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-5">
                                    Please confirm the new date and time for your appointment.
                                </p>

                            </div>


                            {/* SUMMARY */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mt-5">

                                <div className="flex items-center justify-between gap-3">

                                    <span className="text-xs text-slate-400">
                                        Date
                                    </span>

                                    <span className="text-xs font-semibold text-slate-700 text-right">
                                        {selectDate?.day}, {selectDate?.fulldate}
                                    </span>

                                </div>

                                <div className="flex items-center justify-between gap-3 mt-3">

                                    <span className="text-xs text-slate-400">
                                        Time
                                    </span>

                                    <span className="text-xs font-semibold text-slate-700">
                                        {selectTime}
                                    </span>

                                </div>

                            </div>


                            {/* MODAL ACTIONS */}
                            <div className="grid grid-cols-2 gap-2 mt-5">

                                <button
                                    onClick={() => setPopup(false)}
                                    className="h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs sm:text-sm font-medium transition cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleReschedule}
                                    disabled={loading}
                                    className="h-10 rounded-lg bg-(--color-primary) hover:bg-(--color-primary)/90 text-white text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Rescheduling..." : "Confirm"}
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </section>

        </>
    )
}

export default Reschedule