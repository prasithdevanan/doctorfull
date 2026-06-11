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
            <section className="flex px-4 md:px-6 py-6 flex-col items-center">

                <div className="flex flex-col md:flex-row gap-6 items-center max-w-5xl w-full">

                    {/* Image */}
                    <div className="w-full max-w-xs overflow-hidden rounded-3xl border border-gray-200 bg-(--color-primary)/20 shadow-sm">

                        <img
                            src={element.image}
                            alt="doctor"
                            className="w-full h-auto object-cover"
                        />

                    </div>

                    {/* Content */}
                    <div className="w-full md:w-[60%] bg-white rounded-3xl p-6 border border-gray-200 flex flex-col gap-6">

                        {/* Status Row */}
                        <div className="flex items-center justify-between flex-wrap gap-3">

                            <div className="relative flex items-center gap-2">

                                {/* Dot */}
                                <span
                                    className={`w-3 h-3 rounded-full ${onlineStatus ? "bg-green-500" : "bg-gray-400"
                                        }`}
                                ></span>

                                {onlineStatus && (
                                    <span className="absolute left-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75"></span>
                                )}

                                <p className="text-sm font-medium text-gray-600">
                                    {onlineStatus ? "Online" : "Offline"}
                                </p>

                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${element.available
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                    }`}
                            >
                                {element.available ? "Available" : "Unavailable"}
                            </span>
                        </div>

                        {/* Name & Speciality */}
                        <div className="space-y-2">

                            <div className="flex items-center gap-2">
                                <TextAnimation
                                    text={element.name}
                                    className="text-2xl md:text-3xl font-bold text-gray-900"
                                    icon={
                                        <i className="bi bi-patch-check-fill text-blue-500 text-lg"></i>
                                    }
                                />
                            </div>

                            <div className="flex items-center flex-wrap gap-3">

                                <p className="text-base md:text-lg font-medium text-gray-700">
                                    {element.speciality}
                                </p>

                                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                    {element.experience} Experience
                                </span>
                            </div>
                        </div>

                        {/* About */}
                        <div className="space-y-2">

                            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                                About
                                <i className="bi bi-info-circle text-gray-500"></i>
                            </h2>

                            <p className="text-sm md:text-base leading-7 text-gray-500">
                                {element.about}
                            </p>
                        </div>

                        {/* Fees */}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">

                            <p className="text-gray-600 font-medium">
                                Consultation Fee
                            </p>

                            <h2 className="text-2xl font-bold text-green-600">
                                ₹{element.fees}
                            </h2>
                        </div>
                    </div>

                </div>

            </section>

            {/* Booking Section */}
            <section className="mt-6 px-4 mb-30">

                <div className="flex flex-col items-center">

                    <h1 className="mb-3 text-lg font-medium text-gray-700">
                        Booking Slot
                    </h1>

                    {/* Date Slots */}
                    <div className="w-full flex gap-4 overflow-x-auto pb-3 pt-2 no-scrollbar xl:justify-center">

                        {dates.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setSelectedIndex(index);
                                    setSelectDate(item);
                                }}
                                className={`group min-w-[90px] cursor-pointer rounded-2xl border px-4 py-3 flex flex-col items-center justify-center transition-all duration-300 shadow-sm ${selectedIndex === index
                                    ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white border-blue-500 shadow-blue-200 shadow-lg scale-105"
                                    : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-1"
                                    }`}
                            >

                                <p className={`text-sm font-semibold
                ${selectedIndex === index ? "text-white" : "text-gray-700"}
            `}>
                                    {item.day}
                                </p>

                                <p className={`text-xs mt-1
                ${selectedIndex === index ? "text-blue-100" : "text-gray-500"}
            `}>
                                    {item.date}
                                </p>

                            </button>
                        ))}

                    </div>


                    {/* Time Slots */}
                    {selectedIndex !== null && (
                        <div className="w-full flex gap-3 mt-6 overflow-auto pb-3 pt-2 no-scrollbar xl:justify-center">

                            {timeSlots.map((item, index) => {

                                const isBooked = bookedSlots.includes(item);

                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (isBooked) return;

                                            setSelectedTimeslot(index);
                                            setSelectTime(item);
                                        }}

                                        className={`relative cursor-pointer min-w-[110px] rounded-2xl border px-4 py-3 flex flex-col items-center justify-center transition-all duration-300 shadow-sm ${isBooked
                                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-70"
                                            : selectedTimeslot === index
                                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500 shadow-lg shadow-blue-200 scale-105"
                                                : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-1"
                                            }`}
                                    >

                                        <p className={`text-sm font-medium
                        ${selectedTimeslot === index ? "text-white" : ""}
                    `}>
                                            {item}
                                        </p>

                                        {isBooked && (
                                            <span className="text-[10px] mt-1 px-2 py-0.5 rounded-full bg-red-100 text-red-500 font-medium">
                                                Booked
                                            </span>
                                        )}

                                    </button>
                                );
                            })}

                        </div>
                    )}

                    {/* Note */}
                    <p className="mt-2 text-xs italic text-(--color-text1)">
                        Note: Only book available days <span className="text-red-600">*</span>
                    </p>

                </div>

            </section>

            {/* Button */}
            <section className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50">
                <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-3 sm:px-6 sm:py-4">

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                        {/* Fee Section */}
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-xs uppercase tracking-wider text-gray-400">
                                Consultation Fee
                            </span>
                            <span className="text-2xl sm:text-3xl font-bold text-gray-800">
                                ₹{element.fees}
                            </span>
                        </div>

                        {/* Book Button */}
                        <Link
                            to={
                                selectedTimeslot !== null
                                    ? `/doctor/${element._id}/patientdetails`
                                    : "#"
                            }
                            state={{
                                element,
                                fromBooking: true,
                                selectDate,
                                selectTime,
                            }}
                            className="w-full sm:w-auto"
                        >
                            <Button
                                children="Book Appointment"
                                icon={<i className="bi bi-arrow-right-short text-xl"></i>}
                                primary={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300
          ${selectedTimeslot !== null
                                        ? "bg-(--color-primary) text-white hover:shadow-lg hover:scale-105 cursor-pointer"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                            />
                        </Link>

                    </div>
                </div>
            </section>

        </>
    )
}

export default DoctorBooking;