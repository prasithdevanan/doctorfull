import React, { useEffect, useState, useContext, use } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { AppContext } from '../component/CreateContext';
import { Images } from '../assets/img';
import axios from 'axios';
import { toast } from 'react-toastify';

function PatientDetails() {
    const { token, user, BackendUrl } = useContext(AppContext);
    const userEmail = user?.email || '';
    const location = useLocation();
    const navigate = useNavigate();

    ///change the screen from the previous
    useEffect(() => {
        if (!location?.state?.fromBooking) {
            navigate('/doctor');
            return;
        }
    }, [])


    //data for appoinment details
    const [patientName, setPatientName] = useState('');
    const [patientPhone, setPatientPhone] = useState();
    const [reason, setReason] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [doctorEmail, setDoctorEmail] = useState('');
    const [doctorSpeciality, setDoctorSpeciality] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('unpaid');
    const [paymentId, setPaymentId] = useState('null');
    const [status, setStatus] = useState('pending');
    const [fees, setFees] = useState(0);


    //get the data from the previous screen
    const element = location?.state?.element || false;
    const selectTime = location?.state?.selectTime;

    useEffect(() => {
        const selectDate = location?.state?.selectDate.day + ',' + location?.state?.selectDate.fulldate;
        setPatientEmail(user?.email);
        setAppointmentDate(selectDate);
        setAppointmentTime(selectTime);
        setDoctorId(element?._id);
        setDoctorName(element?.name);
        setDoctorEmail(element?.email);
        setDoctorSpeciality(element?.speciality);
        setFees(element?.fees);
    }, [user, location])


    const submitHandle = async (e) => {
        e.preventDefault();
        console.log(e.target);

        const data = {
            patientName,
            patientEmail,
            patientPhone,
            doctorId,
            doctorName,
            doctorEmail,
            doctorSpeciality,
            reason,
            status,
            paymentStatus,
            paymentId,
            fees,
            appointmentDate,
            appointmentTime
        }

        try {
            const res = await axios.post(`${BackendUrl}/api/patient/appointment`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.data.success) {
                console.log(res.data.message);
                toast.error(res.data.message);
                return
            }
            console.log(res.data.appointmentId);

            toast.success(res.data.message);

            navigate(`/doctor/${doctorId}/patientdetails/payment`, { state: { appointmentId: res.data.appointmentId, fees: element?.fees,  element: element, selectTime: appointmentTime, selectDate: appointmentDate, fromBooking: true } });

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }


        console.log(data);
    }

    return (
        <>
            {
                token ? (
                    < div className='w-full h-[calc(100vh-120px)]'>


                        <form action="" onSubmit={submitHandle} className='my-auto mx-auto w-full h-full flex flex-col justify-center items-center'>
                            <div className='px-4 w-1/2 text-center mb-4'>
                                <h2 className='font-medium text-(--color-text)'>Patient Details</h2>
                                <p className='text-(--color-text1)'>Please provide your primary contact and identification details. This information is protected under HIPAA regulations and will only be used for clinical coordination.</p>
                            </div>
                            <p className='py-1 px-4 mb-3 bg-(--color-primary)/20 rounded-full text-(--color-primary)'>Intake Department</p>
                            <div className='grid grid-cols-2 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 gap-4 mb-4 px-4 border border-gray-200 py-4 rounded-md bg-(--color-white) shadow-md shadow-gray-100'>
                                <div>
                                    <p className='text-sm'>PATIENT NAME</p>
                                    <input
                                        type="text"
                                        placeholder='Enter Patient Name'
                                        className='bg-(--color-input) px-2 py-2 border border-gray-200 rounded-md w-full'
                                        required
                                        onChange={(e) => setPatientName(e.target.value)}
                                        value={patientName} />
                                </div>
                                <div>
                                    <p className='text-sm'>PATIENT PHONE</p>
                                    <input type="tel"
                                        maxLength={10}
                                        placeholder='Enter Patient Name'
                                        className='bg-(--color-input) px-2 py-2 border border-gray-200 rounded-md w-full'
                                        required
                                        onChange={(e) => setPatientPhone(e.target.value)}
                                        value={patientPhone} />
                                </div>
                                <div>
                                    <p className='text-sm'>REASON</p>
                                    <textarea name="" id=""
                                        placeholder='Enter Reason'
                                        className='bg-(--color-input) px-2 py-2 border border-gray-200 rounded-md w-full h-24 resize-none'
                                        required
                                        onChange={(e) => setReason(e.target.value)}
                                        value={reason} />
                                </div>
                                <div>
                                    <p className='text-sm'>DOCTOR NAME</p>
                                    <input
                                        type="text"
                                        placeholder='Enter Patient Name'
                                        className='bg-(--color-input) px-2 py-2 border border-gray-200 rounded-md focus:hidden cursor-default w-full'
                                        readOnly
                                        required
                                        value={element.name} />
                                </div>
                            </div>
                            <div className='flex justify-center items-center'>
                                <button className='px-4 py-2 bg-(--color-primary) text-(--color-white) rounded-md cursor-pointer hover:scale-110 hover:transform transition ease-in-out duration-300 hover:shadow-[0px_2px_8px] hover:shadow-(color:--color-primary)/50' type='submit' >Submit Details</button>
                            </div>
                        </form>
                    </div >

                ) : (
                    <div className={` flex flex-col justify-center items-center mt-3 h-[calc(100vh-120px)] `}>
                        <img
                            src={Images.Login}
                            alt="Login"
                            className='w-md mx-auto' />
                        <p
                            className='mx-auto'>
                            Please
                            <Link
                                to="/login"
                                className='text-(--color-primary) font-bold underline'
                                state={{ from: location.pathname }}>
                                login
                            </Link>
                            to access the payment page.
                        </p>
                    </div>
                )

            }

        </>
    )
}

export default PatientDetails;