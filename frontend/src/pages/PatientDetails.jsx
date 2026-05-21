import React, { useEffect, useState, useContext } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { AppContext } from '../component/CreateContext';
import { Images } from '../assets/img';
import axios from 'axios';
import { toast } from 'react-toastify';
import { socket } from '../socket/socket';

function PatientDetails() {
    const { token, user, BackendUrl } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [userElement, setUserElement] = useState({});

    useEffect(() => {
        setUserElement(user);
    }, [user])

    ///change the screen from the previous
    useEffect(() => {
        console.log(location.state)
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
    const [patientId, setPatientId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [doctorEmail, setDoctorEmail] = useState('');
    const [doctorSpeciality, setDoctorSpeciality] = useState('');
    const [image, setImage] = useState('');
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
        setPatientId(user?.patientId);
        setDoctorId(element?._id);
        setDoctorName(element?.name);
        setDoctorEmail(element?.email);
        setImage(element?.image);
        setDoctorSpeciality(element?.speciality);
        setFees(element?.fees);
    }, [user, location])


    const submitHandle = async (e) => {
        e.preventDefault();

        const data = {
            patientName,
            patientEmail,
            patientPhone,
            patientId,
            doctorId,
            doctorName,
            doctorEmail,
            doctorSpeciality,
            image,
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
                toast.error(res.data.message);
                return
            }

            socket.emit("book_appointment", { patientId: userElement?.id, doctorId, details: data });


            toast.success(res.data.message);

            navigate(`/doctor/${doctorId}/patientdetails/payment`, { state: { appointmentId: res.data.appointmentId, fees: element?.fees, element: element, selectTime: appointmentTime, selectDate: appointmentDate, fromBooking: true } });

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    }

    return (
        <>
            {
                token ? (

                    <div className="w-full min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-10 gap-10 bg-gray-50">

                        {/* ===== Form ===== */}
                        <form
                            onSubmit={submitHandle}
                            className="w-full max-w-4xl flex flex-col items-center"
                        >

                            {/* Header */}
                            <div className="text-center mb-6 px-2">
                                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                                    Patient Details
                                </h2>

                                <p className="text-sm text-gray-500 mt-2 max-w-xl">
                                    Please provide your primary contact and identification details.
                                </p>
                            </div>

                            {/* Tag */}
                            <p className="px-4 py-1 mb-6 rounded-full text-sm bg-blue-100 text-blue-600 font-medium">
                                Intake Department
                            </p>

                            <div className="relative w-full max-w-4xl flex-col sm:flex-row flex gap-6 p-6 rounded-2xl bg-white border border-gray-100 mb-4">
                                <p className='absolute right-0 top-0 opacity-50 px-4 py-2'>Doctor Details</p>
                                {/* Image */}
                                <div className="flex-shrink-0">
                                    <img
                                        src={location?.state?.element?.image}
                                        alt={location?.state?.element?.name}
                                        className="w-28 h-28 md:w-36 md:h-36 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex flex-col justify-center gap-2">

                                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                                        {location?.state?.element?.name}
                                    </h1>

                                    <p className="text-sm md:text-base text-gray-500 capitalize">
                                        {location?.state?.element?.speciality}
                                    </p>

                                    <p className="text-sm md:text-base font-medium text-gray-800">
                                        Fees:{" "}
                                        <span className="text-green-600 font-semibold">
                                            ₹{location?.state?.element?.fees}
                                        </span>
                                    </p>

                                    <div className="mt-2 flex gap-1 text-sm md:text-base text-gray-700">
                                        <p className='font-semibold'>
                                            <span className="font-medium text-gray-500">Time:</span>{" "}
                                            {location?.state?.selectTime}
                                        </p>

                                        <p className='font-semibold'>
                                            <span className="font-medium text-gray-500">Date:</span>{" "}
                                            {location?.state?.selectDate?.day}, {location?.state?.selectDate?.fulldate}
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Form Card */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full p-6 rounded-2xl bg-white shadow-md border border-gray-100">

                                {/* Name */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-500">PATIENT NAME</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Patient Name"
                                        required
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        className="px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-500">PATIENT PHONE</label>
                                    <input
                                        type="tel"
                                        maxLength={10}
                                        placeholder="Enter Phone Number"
                                        required
                                        value={patientPhone}
                                        onChange={(e) => setPatientPhone(e.target.value)}
                                        className="px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                {/* Reason */}
                                <div className="flex flex-col gap-1 sm:col-span-2">
                                    <label className="text-xs text-gray-500">REASON</label>
                                    <textarea
                                        placeholder="Enter Reason"
                                        required
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="px-3 py-2 h-24 resize-none rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                {/* Doctor */}
                                <div className="flex flex-col gap-1 sm:col-span-2">
                                    <label className="text-xs text-gray-500">DOCTOR NAME</label>
                                    <input
                                        type="text"
                                        value={location?.state?.element?.name}
                                        readOnly
                                        className="px-3 py-2 rounded-md bg-gray-100 border border-gray-200 text-gray-500"
                                    />
                                </div>

                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                className="mt-6 px-6 py-2 rounded-md bg-blue-600 text-white 
      hover:scale-105 transition duration-300 shadow-sm hover:shadow-md"
                            >
                                Submit Details
                            </button>

                        </form>

                    </div>

                ) : (

                    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 text-center">

                        <img
                            src={Images.Login}
                            alt="login"
                            className="w-60 md:w-80 mb-4"
                        />

                        <p className="text-gray-600">
                            Please{" "}
                            <Link
                                to="/login"
                                state={{ from: location.pathname }}
                                className="text-(--color-primary) font-semibold underline"
                            >
                                login
                            </Link>{" "}
                            to access the booking page.
                        </p>

                    </div>

                )
            }
        </>
    )
}

export default PatientDetails;