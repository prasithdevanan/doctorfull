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
            <section className=''>
                <Link to="/appointment" className='flex gap-1 px-2 w-fit items-center mt-4 ml-4 rounded-md py-2 hover:bg-gray-100'><span>{<i className="bi bi-arrow-left-short text-2xl"></i>}</span>Back</Link>
                <div>
                    <h2 className='text-center text-2xl font-medium mb-4'>Reschedule Appointment</h2>

                    {/* -----------------------------Doctor Details------------------------ */}
                    <div className="relative bg-gray-50 p-4 rounded-xl border border-gray-200 w-full max-w-sm flex mx-auto items-center gap-3 mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
                        <div className='p-2 bg-(--color-primary)/20 rounded-full px-3 text-(--color-primary)'>
                            <span>{<i className="bi bi-calendar-x"></i>}</span>
                        </div>
                        <div>

                            <p className="text-xs font-medium text-gray-400 tracking-wide mb-1">
                                CURRENT SCHEDULE
                            </p>

                            <h2 className="text-base font-semibold text-gray-800 mb-2">
                                {appointment?.doctorName}
                            </h2>

                            <div className="space-y-1">
                                <p className="text-sm text-gray-700">
                                    {appointment?.appointmentDate}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {appointment?.appointmentTime}
                                </p>
                                <span className='tracking-wide text-xs bg-red-200 p-1 px-2 rounded-full text-red-600 absolute top-1/2 right-3 -translate-y-1/2'>TO BE CHANGE</span>
                            </div>

                        </div>

                    </div>
                </div>
                <div className="flex overflow-x-auto gap-3 px-4 scroll-smooth justify-start xl:justify-center mx-auto no-scrollbar">
                    {dates.map((item, index) => {
                        const formet = item.day + "," + item.fulldate;

                        const isSelected =
                            selectedIndex === index ||
                            appointment?.appointmentDate === formet;


                        return (
                            <div
                                key={index}
                                ref={isSelected ? selectedRef : null}
                                onClick={() => {
                                    setSelectDate(item);
                                    setSelectedIndex(index);
                                }}
                                className={`flex flex-col items-center justify-center border p-4 rounded-md min-w-[80px] cursor-pointer transition-all duration-200
              ${isSelected
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "border-gray-300 hover:border-blue-500 hover:text-blue-500"
                                    }`}
                            >
                                <p className="text-sm">{item.date}</p>
                                <p className="text-xs">{item.day}</p>
                            </div>
                        );
                    })}
                </div>
                <div className='flex justify-center gap-3 flex-col mt-4'>
                    <p className='mx-auto mt-3'>Time Slot</p>
                    <div className='flex flex-wrap gap-3 justify-center'>
                        {
                            timeSlots.map((item, index) => {
                                const isBooked = bookedSlots.includes(item);
                                return (
                                    <div key={index}
                                        className={`flex flex-col p-4 border mb-2 items-center rounded-md cursor-pointer transition justify-center min-w-[80px]
                                        ${isBooked
                                                ? 'bg-gray-100 text-gray-500 border-gray-300'
                                                : selectTime === item
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'border-gray-300 hover:border-(--color-primary) hover:text-(--color-primary) w-fit'
                                            }`}
                                        onClick={() => { if (isBooked) return; setSelectTime(item); }}
                                    >
                                        <p className="text-sm">{item}</p>
                                        {isBooked && <p className='text-xs'>Booked</p>}

                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

               { selectTime && <button className='bg-(--color-primary) py-2 px-4 text-(--color-white) hover:bg-(--color-primary)/90 transition-all duration-300 hover:scale-105 rounded-md cursor-pointer mt-4 mx-auto flex mb-4' onClick={checkPopup}>Reschedule</button>}

                {popup &&
                    <div className='absolute top-0 left-0 w-full flex items-center justify-center bg-black/20 bg-opacity-50 z-999'>
                        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50 backdrop-blur-md">
                            <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md animate-fadeIn">

                                <h2 className="text-xl font-semibold mb-3">
                                    Reschedule Appointment
                                </h2>

                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to reschedule this appointment?
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button

                                        className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer" onClick={() => setPopup(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button

                                        className="px-4 py-2 rounded-md bg-(--color-primary) text-white hover:bg-(--color-primary)/90 cursor-pointer" onClick={handleReschedule}
                                    >
                                        {loading ? 'Rescheduling...' : 'Yes, Reschedule'}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                }
            </section>

        </>
    )
}

export default Reschedule