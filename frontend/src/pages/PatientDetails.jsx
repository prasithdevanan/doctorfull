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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setUserElement(user);
    }, [user])

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
        socket.connect();
        setLoading(true);
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
            socket.emit("book_appointment", { patientId: userElement?.id, doctorId, appointmentId: res.data.appointmentId, details: data });


            toast.success(res.data.message);

            navigate(`/doctor/${doctorId}/patientdetails/payment`, { state: { appointmentId: res.data.appointmentId, fees: element?.fees, element: element, selectTime: appointmentTime, selectDate: appointmentDate, patientName: patientName, patientPhone: patientPhone, patientEmail: patientEmail, fromBooking: true } });

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {
                token ? (

                    <div
                        className="w-full flex flex-col xl:flex-row gap-5 items-stretch justify-center h-fit xl:h-[90vh]">

                        {/* ===== Form ===== */}
                        <form
                            onSubmit={submitHandle}
                            className="w-full max-w-7xl mx-auto flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8"
                        >
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                    Patient Details
                                </h2>

                                <p className="text-sm md:text-base text-gray-500 mt-3 max-w-2xl leading-relaxed">
                                    Please provide your primary contact and identification details.
                                </p>
                            </div>

                            {/* Department Tag */}


                            {/* Main Container */}
                            <div
                                className="w-full flex flex-col xl:flex-row gap-8 items-stretch justify-center"
                            >
                                {/* Doctor Card */}
                                <div
                                    className="relative w-full xl:w-[35%] bg-gray-50 border border-gray-200 rounded-3xl p-6 overflow-hidden"
                                >
                                    <p
                                        className="absolute top-4 right-4 text-xs md:text-sm text-gray-400 font-semibold uppercase tracking-wider"
                                    >
                                        Doctor Details
                                    </p>

                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={location?.state?.element?.image}
                                            alt={location?.state?.element?.name}
                                            className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-white mt-4"
                                        />

                                        <div className="mt-6 flex flex-col gap-2">
                                            <h1
                                                className="text-2xl md:text-3xl font-bold text-gray-900"
                                            >
                                                {location?.state?.element?.name}
                                            </h1>

                                            <p className="text-sm md:text-base text-gray-600 m-0">{location?.state?.element?.email}</p>
                                            <p className="text-sm md:text-base text-blue-600 font-medium capitalize" >
                                                {location?.state?.element?.speciality}
                                            </p>

                                            <p className="text-lg font-semibold text-gray-800">
                                                Fees :
                                                <span className="text-green-600 ml-2">
                                                    ₹{location?.state?.element?.fees}
                                                </span>
                                            </p>

                                            <div
                                                className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-3"
                                            >
                                                <div
                                                    className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold"
                                                >
                                                    Time : {location?.state?.selectTime}
                                                </div>

                                                <div
                                                    className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-semibold"
                                                >
                                                    Date : {location?.state?.selectDate?.day},{" "}
                                                    {location?.state?.selectDate?.fulldate}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Card */}
                                <div
                                    className="w-full xl:w-[65%] bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8"
                                >
                                    <p
                                        className="px-5 w-fit mx-auto py-2 mb-4 rounded-full text-sm font-semibold bg-(--color-primary)/10 text-(--color-primary) tracking-wider" >
                                        Intake Department
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Patient Name */}
                                        <div className="flex flex-col gap-2">
                                            <label
                                                className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
                                            >
                                                Patient Name <span className="text-red-600">*</span>
                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Enter Patient Name"
                                                required
                                                value={patientName}
                                                onChange={(e) => setPatientName(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                                            />
                                        </div>

                                        {/* Patient Phone */}
                                        <div className="flex flex-col gap-2">
                                            <label
                                                className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
                                            >
                                                Patient Phone <span className="text-red-600">*</span>
                                            </label>

                                            <input
                                                type="tel"
                                                maxLength={10}
                                                placeholder="Enter Phone Number"
                                                required
                                                value={patientPhone}
                                                onChange={(e) => setPatientPhone(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                                            />
                                        </div>

                                        {/* Reason */}
                                        <div className="flex flex-col gap-2 md:col-span-2">
                                            <label
                                                className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
                                            >
                                                Reason <span className="text-red-600">*</span>
                                            </label>

                                            <textarea
                                                placeholder="Enter Reason"
                                                required
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                className="w-full px-4 py-3 h-32 resize-none rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                                            />
                                        </div>

                                        {/* Doctor Name */}
                                        <div className="flex flex-col gap-2 md:col-span-2">
                                            <label
                                                className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
                                            >
                                                Doctor Name
                                            </label>

                                            <input
                                                type="text"
                                                value={location?.state?.element?.name}
                                                readOnly
                                                className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <div className="flex justify-center md:justify-end mt-8">
                                        <button
                                            type="submit"
                                            className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                                        >
                                            {loading ? "Loading..." : "Book Appointment"}
                                        </button>
                                    </div>
                                </div>
                            </div>
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