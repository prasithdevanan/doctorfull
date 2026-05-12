import React, { useState, useContext } from 'react'
import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../component/Button';
import TextAnimation from '../component/TextAnimation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../component/CreateContext';

function DoctorBooking() {
    const { BackendUrl } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();
    const element = location.state ? location.state.element : false;
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedTimeslot, setSelectedTimeslot] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);

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
        console.log(selectDate);
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
                // console.error('Error fetching booked slots:', error);
                toast.error('Failed to fetch booked slots. Please try again later.');
            }
        }
        featchBookedSlots();
    }, [selectDate]);



    return (
        <>
            <section className="flex px-4 md:px-6 py-6 flex-col items-center">

                <div className="flex flex-col md:flex-row gap-6 items-center max-w-5xl w-full">

                    {/* Image */}
                    <div className="overflow-hidden border border-(--color-text1) rounded-xl w-full max-w-xs">
                        <img
                            src={element.image}
                            alt="doctor"
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-4 w-full md:w-[60%]">

                        {/* Availability */}
                        <p className={`text-sm font-medium ${element.avilable ? 'text-green-600' : 'text-red-600'}`}>
                            {element.avilable ? "Available" : "Unavailable"}
                        </p>

                        {/* Name & speciality */}
                        <div>
                            <TextAnimation
                                text={element.name}
                                className="text-xl md:text-2xl font-medium"
                                icon={<i className="bi bi-patch-check-fill text-blue-600"></i>}
                            />

                            <p className="text-base md:text-lg font-medium text-(--color-text)">
                                {element.speciality}

                                <span className="ml-2 px-2 py-0.5 border border-(--color-text1) rounded-full text-xs text-(--color-text1)">
                                    {element.experience}
                                </span>
                            </p>
                        </div>

                        {/* About */}
                        <div>
                            <h1 className="font-semibold text-sm md:text-base">
                                About <i className="bi bi-info-circle"></i>
                            </h1>

                            <p className="text-sm text-(--color-text2) leading-relaxed">
                                {element.about}
                            </p>
                        </div>

                        {/* Fees */}
                        <h2 className="font-medium text-(--color-text)">
                            Appointment Fees - {element.fees}
                        </h2>

                    </div>

                </div>

            </section>

            {/* Booking Section */}
            <section className="mt-6 px-4">

                <div className="flex flex-col items-center">

                    <h1 className="mb-3 text-lg font-medium text-gray-700">
                        Booking Slot
                    </h1>

                    {/* Date Slots */}
                    <div className="w-full flex gap-3 overflow-x-auto xl:justify-center pb-2 no-scrollbar">

                        {dates.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedIndex(index);
                                    setSelectDate(item);
                                }}
                                className={`min-w-[80px] flex flex-col items-center p-3 border rounded-md cursor-pointer transition
            ${selectedIndex === index
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "border-(--color-text1) hover:border-(--color-primary) hover:text-(--color-primary)"
                                    }`}
                            >
                                <p className="text-sm">{item.day}</p>
                                <p className="text-xs">{item.date}</p>
                            </div>
                        ))}

                    </div>

                    {/* Time Slots */}
                    {selectedIndex !== null && (
                        <div className="flex gap-2 mt-4 mb-2 overflow-x-auto pb-2 w-full xl:justify-center no-scrollbar">

                            {timeSlots.map((item, index) => {
                                const isBooked = bookedSlots.includes(item);

                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            if (isBooked) return;
                                            setSelectedTimeslot(index);
                                            setSelectTime(item);
                                        }}
                                        className={`min-w-[90px] flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer transition
                ${isBooked
                                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                                : selectedTimeslot === index
                                                    ? "bg-blue-500 text-white border-blue-500"
                                                    : "border-(--color-text1) hover:border-(--color-primary) hover:text-(--color-primary)"
                                            }`}
                                    >
                                        <p className="text-sm">{item}</p>
                                        {isBooked && <span className="text-xs">Booked</span>}
                                    </div>
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
            <section className="flex justify-center mt-6 mb-8 px-4">

                <Link
                    to={selectedTimeslot !== null ? `/doctor/${element._id}/patientdetails` : "#"}
                    state={{ element, fromBooking: true, selectDate, selectTime }}
                >
                    <Button
                        children="Book Appointment"
                        icon={<i className="bi bi-arrow-right-short text-2xl"></i>}
                        primary={`flex items-center gap-2 px-4 py-2 rounded-full transition duration-300 cursor-pointer
        ${selectedTimeslot !== null
                                ? "bg-(--color-primary) text-(--color-white) hover:scale-105"
                                : "bg-(--color-input) text-(--color-text2) cursor-not-allowed"
                            }`}
                    />
                </Link>

            </section>

        </>
    )
}

export default DoctorBooking;