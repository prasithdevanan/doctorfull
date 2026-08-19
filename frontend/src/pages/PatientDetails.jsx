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

                    <div className="h-[calc(100vh-72px)] w-full bg-slate-50">

                        <form onSubmit={submitHandle} className="mx-auto flex h-full w-full max-w-7xl flex-col px-3 py-3 sm:px-4 sm:py-4 md:px-6 lg:px-8">

                            {/* Header */}
                            {/* <div className="shrink-0 pb-4 text-center sm:pb-5">

                                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                                    Patient Details
                                </h2>

                                <p className="mx-auto mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500 sm:mt-2 sm:text-sm md:text-base">
                                    Please provide your primary contact and identification details.
                                </p>

                            </div> */}


                            {/* Main Content */}
                            <div className="flex-1">

                                <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-5">

                                    {/* ================================================= */}
                                    {/* DOCTOR CARD */}
                                    {/* ================================================= */}

                                    <section className=" rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5 no-scrollbar">

                                        <div className="flex flex-col items-center text-center">

                                            {/* Label */}
                                            <div className="mb-3 flex w-full items-center justify-between">

                                                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-[10px]">
                                                    Doctor Details
                                                </span>

                                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold text-emerald-600">
                                                    Confirmed
                                                </span>

                                            </div>


                                            {/* Doctor Image */}
                                            <div className="relative h-[140px] w-[140px] shrink-0 overflow-hidden rounded-[1.5rem] bg-slate-100 sm:h-[155px] sm:w-[155px]">

                                                <img
                                                    src={location?.state?.element?.image}
                                                    alt={location?.state?.element?.name}
                                                    className="h-full w-full object-cover object-center"
                                                />

                                            </div>


                                            {/* Doctor Info */}
                                            <div className="mt-4 flex w-full flex-col gap-1.5">

                                                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                                    {location?.state?.element?.name}
                                                </h1>

                                                <p className="truncate text-xs text-slate-500 sm:text-sm">
                                                    {location?.state?.element?.email}
                                                </p>

                                                <p className="text-xs font-semibold capitalize text-blue-600 sm:text-sm">
                                                    {location?.state?.element?.speciality}
                                                </p>

                                            </div>


                                            {/* Fee */}
                                            <div className="mt-4 flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">

                                                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                                                    Consultation
                                                </span>

                                                <span className="text-lg font-bold text-emerald-600">
                                                    ₹{location?.state?.element?.fees}
                                                </span>

                                            </div>


                                            {/* Appointment Details */}
                                            <div className="mt-3 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">

                                                <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-left">

                                                    <p className="text-[9px] font-semibold uppercase tracking-wider text-blue-400">
                                                        Time
                                                    </p>

                                                    <p className="mt-0.5 text-xs font-semibold text-blue-700">
                                                        {location?.state?.selectTime}
                                                    </p>

                                                </div>


                                                <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2.5 text-left">

                                                    <p className="text-[9px] font-semibold uppercase tracking-wider text-indigo-400">
                                                        Date
                                                    </p>

                                                    <p className="mt-0.5 text-xs font-semibold text-indigo-700">
                                                        {location?.state?.selectDate?.day},{" "}
                                                        {location?.state?.selectDate?.fulldate}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </section>


                                    {/* ================================================= */}
                                    {/* FORM CARD */}
                                    {/* ================================================= */}

                                    <section className="flex flex-col rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">

                                        {/* Form Header */}
                                        <div className="shrink-0 border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4 md:px-6">

                                            <div className="flex items-center justify-between gap-3">

                                                <div>

                                                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-500 sm:text-[10px]">
                                                        Patient Information
                                                    </p>

                                                    <h3 className="mt-0.5 text-base font-bold text-slate-900 sm:text-lg">
                                                        Complete your details
                                                    </h3>

                                                </div>

                                                <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-[9px] font-medium text-slate-500 sm:block">
                                                    Intake Department
                                                </span>

                                            </div>

                                        </div>


                                        {/* Form Content */}
                                        <div className="flex-1 px-4 py-4 sm:px-5 sm:py-5 md:px-6 no-scrollbar">

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">

                                                {/* Patient Name */}
                                                <div className="flex flex-col gap-1.5">

                                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 sm:text-xs">
                                                        Patient Name <span className="text-red-500">*</span>
                                                    </label>

                                                    <input
                                                        type="text"
                                                        placeholder="Enter patient name"
                                                        required
                                                        value={patientName}
                                                        onChange={(e) => setPatientName(e.target.value)}
                                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                                    />

                                                </div>


                                                {/* Patient Phone */}
                                                <div className="flex flex-col gap-1.5">

                                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 sm:text-xs">
                                                        Patient Phone <span className="text-red-500">*</span>
                                                    </label>

                                                    <input
                                                        type="tel"
                                                        maxLength={10}
                                                        placeholder="Enter phone number"
                                                        required
                                                        value={patientPhone}
                                                        onChange={(e) => setPatientPhone(e.target.value)}
                                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                                    />

                                                </div>


                                                {/* Reason */}
                                                <div className="flex flex-col gap-1.5 md:col-span-2">

                                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 sm:text-xs">
                                                        Reason <span className="text-red-500">*</span>
                                                    </label>

                                                    <textarea
                                                        placeholder="Briefly describe the reason for consultation..."
                                                        required
                                                        value={reason}
                                                        onChange={(e) => setReason(e.target.value)}
                                                        className="min-h-[80px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:min-h-[90px]"
                                                    />

                                                </div>


                                                {/* Appointment Summary */}
                                                <div className="md:col-span-2">

                                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:p-4">

                                                        <div className="mb-3 flex items-center justify-between">

                                                            <h4 className="text-xs font-semibold text-slate-800 sm:text-sm">
                                                                Appointment Summary
                                                            </h4>

                                                            <i className="bi bi-calendar-check text-sm text-blue-500" />

                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

                                                            <div className="rounded-xl bg-white px-3 py-2">

                                                                <p className="text-[9px] uppercase tracking-wider text-slate-400">
                                                                    Doctor
                                                                </p>

                                                                <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
                                                                    {location?.state?.element?.name}
                                                                </p>

                                                            </div>

                                                            <div className="rounded-xl bg-white px-3 py-2">

                                                                <p className="text-[9px] uppercase tracking-wider text-slate-400">
                                                                    Date
                                                                </p>

                                                                <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
                                                                    {location?.state?.selectDate?.fulldate}
                                                                </p>

                                                            </div>

                                                            <div className="col-span-2 rounded-xl bg-white px-3 py-2 sm:col-span-1">

                                                                <p className="text-[9px] uppercase tracking-wider text-slate-400">
                                                                    Time
                                                                </p>

                                                                <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
                                                                    {location?.state?.selectTime}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>


                                        {/* Footer */}
                                        <div className="shrink-0 border-t border-slate-100 px-4 py-3 sm:px-5 sm:py-4 md:px-6">

                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                                <div className="text-center sm:text-left">

                                                    <p className="text-[9px] uppercase tracking-wider text-slate-400">
                                                        Consultation Fee
                                                    </p>

                                                    <p className="text-lg font-bold text-slate-900 sm:text-xl">
                                                        ₹{location?.state?.element?.fees}
                                                    </p>

                                                </div>


                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                                >

                                                    {loading ? (
                                                        <>
                                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Book Appointment
                                                            <i className="bi bi-arrow-right-short text-xl" />
                                                        </>
                                                    )}

                                                </button>

                                            </div>

                                        </div>

                                    </section>

                                </div>

                            </div>

                        </form>

                    </div>

                ) : (

                    <div className="flex h-[calc(100vh-72px)] flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 text-center">

                        <img
                            src={Images.Login}
                            alt="login"
                            className="mb-4 w-52 sm:w-60 md:w-72"
                        />

                        <h2 className="text-lg font-semibold text-slate-800 sm:text-xl">
                            Login required
                        </h2>

                        <p className="mt-2 max-w-md text-sm text-slate-500">
                            Please{" "}
                            <Link
                                to="/login"
                                state={{ from: location.pathname }}
                                className="font-semibold text-[var(--color-primary)] underline underline-offset-2"
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