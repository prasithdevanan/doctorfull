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
                console.log("Booked Slots:", res.data.bookedSlots);

                console.log(res.data);

            } catch (error) {
                console.error('Error fetching booked slots:', error);
                toast.error('Failed to fetch booked slots. Please try again later.');
            }
        }
        featchBookedSlots();
    }, [selectDate]);



    return (
        <>
            <section className='flex px-6 py-4 flex-col items-center justify-center'>
                <div className='flex gap-5 justify-center items-center'>
                    <div className={`overflow-hidden border rounded-md border-(--color-text1) h-fit max-w-3xs`}>
                        <img src={element.image} alt="img" className='w-full h-auto object-cover' />
                    </div>
                    <div className=' flex flex-col justify-center w-[60%] gap-4'>
                        {
                            element.avilable ?
                                <p className='text-green-600 w-full'>Available</p> :
                                <p className='text-red-600 w-full'>Unavailable</p>
                        }
                        <div className='w-full'>
                            <TextAnimation text={element.name} className='text-2xl font-light justify-baseline' icon={<i className="bi bi-patch-check-fill text-blue-700"></i>} />
                            <p className='text-xl font-medium text-(--color-text)'>{element.speciality}
                                <span className='font-light px-2 border-2 ml-2 border-(--color-text1) rounded-full text-(--color-text1)'>{element.experience}</span>
                            </p>
                        </div>
                        <div className='w-full'>
                            <h1 className='font-semibold'>About <i className="bi bi-info-circle"></i></h1>
                            <p className='text-(--color-text2)'>{element.about}</p>
                        </div>
                        <h2>Appoinment Fees -{element.fees}</h2>

                    </div>
                </div>
            </section>

            <section className='mt-3'>
                <div className='flex flex-col items-center'>
                    <h1 className='mb-2'>Booking Slot</h1>
                    <div className='w-full flex gap-3 h-auto sm:justify-center overflow-scroll sm:px-3'>
                        {
                            dates.map((item, index) => {
                                return (
                                    <div key={index} onClick={() => { setSelectedIndex(index); setSelectDate(item); }} className={`flex flex-col p-4 border mb-2 items-center rounded-md cursor-pointer transition ${selectedIndex === index ? 'bg-blue-500 text-white border-blue-500'
                                        : 'border-(--color-text1) hover:border-(--color-primary) hover:text-(--color-primary)'
                                        }`}>
                                        <h1>{item.day}</h1>
                                        <h1>{item.date}</h1>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {/* //---------------time slot----------- */}
                    {selectedIndex !== null &&
                        <div className='flex gap-2 mt-3 mb-2'>
                            {
                                timeSlots.map((item, index) => {
                                    const isBooked = bookedSlots.includes(item);
                                    return (
                                        <div key={index}
                                            onClick={() => { if (isBooked) return; setSelectedTimeslot(index); setSelectTime(item); }}
                                            className={`flex flex-col p-4 border mb-2 items-center rounded-md cursor-pointer transition justify-center ${isBooked ? 'bg-gray-100 text-gray-500 border-gray-200' : selectedTimeslot === index ? 'bg-blue-500 text-white border-blue-500'
                                                : 'border-(--color-text1) hover:border-(--color-primary) hover:text-(--color-primary)'
                                                }`}>
                                            <h2>{item}</h2>
                                            {isBooked && <span className='text-red-600 text-sm'>Booked</span>}
                                        </div>

                                    )
                                })
                            }
                        </div>
                    }
                    <div>

                    </div>
                    <p className='font-light italic text-(--color-text1) '>Note: Only Book those days only <span className='text-red-600'>*</span></p>
                </div>
            </section>

            <section className='flex mx-auto px-6 justify-center mt-6 mb-6'>
                <Link to={selectedTimeslot !== null ? `/doctor/${element._id}/patientdetails` : "#"} state={{ element, fromBooking: true, selectDate: selectDate, selectTime: selectTime }}>

                    <Button children="Book Appoiment" icon={<i className="bi bi-arrow-right-short text-2xl flex items-center"></i>} primary={`${selectedTimeslot !== null ? "bg-(--color-primary) hover:scale-105 text-(--color-white)" : "bg-(--color-text1)"} flex rounded-full px-3 py-2 transition ease-in-out duration-300 cursor-pointer text-(--color-text2)`} />
                </Link>
            </section>

        </>
    )
}

export default DoctorBooking;