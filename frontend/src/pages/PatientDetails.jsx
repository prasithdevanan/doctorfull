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
    console.log(element);
    console.log(selectTime);

    useEffect(() => {
        const selectDate = location?.state?.selectDate.day + ',' + location?.state?.selectDate.fulldate;
        setPatientEmail(user?.email);
        setAppointmentDate(selectDate);
        setAppointmentTime(selectTime);
        setDoctorId(element?._id);
        setDoctorName(element?.name);
        setDoctorEmail(element?.email);
        setImage(element?.image);
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
                console.log(res.data.message);
                toast.error(res.data.message);
                return
            }
            console.log(res.data.appointmentId);

            toast.success(res.data.message);

            navigate(`/doctor/${doctorId}/patientdetails/payment`, { state: { appointmentId: res.data.appointmentId, fees: element?.fees, element: element, selectTime: appointmentTime, selectDate: appointmentDate, fromBooking: true } });

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }


        console.log(data);
    }

    return (
        <>
            {
                token ? (

                    <div className="w-full min-h-[calc(100vh-120px)] flex items-center justify-center px-4">

                        <form
                            onSubmit={submitHandle}
                            className="w-full max-w-3xl flex flex-col items-center"
                        >

                            {/* Header */}
                            <div className="text-center mb-6 px-2">
                                <h2 className="text-xl md:text-2xl font-semibold text-(--color-text)">
                                    Patient Details
                                </h2>

                                <p className="text-sm text-(--color-text1) mt-2">
                                    Please provide your primary contact and identification details.
                                    This information is protected and used only for clinical coordination.
                                </p>
                            </div>

                            {/* Tag */}
                            <p className="px-4 py-1 mb-5 rounded-full text-sm bg-(--color-primary)/20 text-(--color-primary)">
                                Intake Department
                            </p>

                            {/* Form Card */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full 
          p-5 border border-gray-200 rounded-xl bg-(--color-white) shadow-sm">

                                {/* Name */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-500">PATIENT NAME</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Patient Name"
                                        required
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        className="px-3 py-2 rounded-md bg-(--color-input) border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
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
                                        className="px-3 py-2 rounded-md bg-(--color-input) border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
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
                                        className="px-3 py-2 h-24 resize-none rounded-md bg-(--color-input) border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                                    />
                                </div>

                                {/* Doctor */}
                                <div className="flex flex-col gap-1 sm:col-span-2">
                                    <label className="text-xs text-gray-500">DOCTOR NAME</label>
                                    <input
                                        type="text"
                                        value={element.name}
                                        readOnly
                                        className="px-3 py-2 rounded-md bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                className="mt-6 px-5 py-2 rounded-md bg-(--color-primary) text-(--color-white) 
          hover:scale-105 transition duration-300 shadow-sm hover:shadow-md mb-5"
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