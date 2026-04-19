import React, { useState, useEffect, use } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../component/CreateContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';


function Reschedule() {
    const location = useLocation();
    const appointment = location.state?.appointment || null;
    console.log(appointment._id);
    const [selectDate, setSelectDate] = useState(null);
    const [selectTime, setSelectTime] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    const { BackendUrl } = useContext(AppContext);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [currentDate, setCurrentDate] = useState(appointment?.appointmentDate);

    const dates = [];
    const baseDate = new Date();

    //---

    useEffect(() => {
        const format = appointment?.appointmentDate;
        setCurrentDate(format);
        console.log(format);
    }, [appointment]);
    //-------------------------Date calcualte------------------------
    for (let i = 0; i <= 10; i++) {
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
        // if (!currentDate || !selectDate) return console.log("No date selected");
        const dateFormate = selectDate ? selectDate.day + "," + selectDate.fulldate : currentDate;
        console.log(dateFormate);
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
                console.log("Booked Slots:", res.data.bookedSlots);

                console.log(res.data);

            } catch (error) {
                console.error('Error fetching booked slots:', error);
                toast.error('Failed to fetch booked slots. Please try again later.');
            }
        }
        featchBookedSlots();
    }, [selectDate]);

    const handleReschedule = async () => {
        if (!selectDate || !selectTime) {
            return toast.error("Please select both date and time for rescheduling.");
        }

        try {
            const res = await axios.patch(`${BackendUrl}/api/patient/appointment/reschedule/${appointment._id}`, {
                doctorId: appointment.doctorId,
                appointmentDate: selectDate.day + "," + selectDate.fulldate,
                appointmentTime: selectTime,
                status: "rescheduled"
            });

            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            toast.error('Failed to reschedule appointment. Please try again later.');
        }



    }


    return (
        <>
            <div className='flex gap-1 justify-center overflow-x-auto'>
                <p>{appointment.doctorName}</p>
                {
                    dates.map((item, index) => {
                        const formet = item.day + "," + item.fulldate;
                        return (
                            <div key={index} className={`flex flex-col items-center justify-center border p-4 rounded-md w-fit hover:border-(--color-primary) cursor-pointer ${selectedIndex === index ? 'bg-blue-500 text-white border-blue-500'
                                : 'border-(--color-text1) hover:border-(--color-primary) hover:text-(--color-primary)'} ${appointment?.appointmentDate === formet && 'bg-blue-500/50 text-white border-blue-500'}`} onClick={() => { setSelectDate(item); setSelectedIndex(index); }}>
                                <p>{item.date}</p>
                                <p>{item.day}</p>
                            </div>
                        )
                    })
                }
            </div>
            <div className='flex'>
                {
                    timeSlots.map((item, index) => {
                        const isBooked = bookedSlots.includes(item);
                        return (
                            <div key={index}
                                className={`flex flex-col p-4 border mb-2 items-center rounded-md cursor-pointer transition justify-center ${isBooked ? 'bg-gray-100 text-gray-500 border-gray-200' : selectTime === item ? 'bg-blue-500 text-white border-blue-500'
                                    : 'border-(--color-text1) hover:border-(--color-primary) hover:text-(--color-primary) w-fit'
                                    }`}
                                onClick={() => { if (isBooked) return; setSelectTime(item); }}
                            >
                                <p> {item}</p>
                                {isBooked && <p>Booked</p>}

                            </div>
                        )
                    })
                }
            </div>
            <div>
                <button className='bg-(--color-primary) py-2 px-4 text-(--color-white) rounded-md cursor-pointer' onClick={handleReschedule}>Reschedule Appointment</button>
            </div>

        </>
    )
}

export default Reschedule