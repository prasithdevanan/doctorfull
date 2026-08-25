import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

function AppoitmentDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const element = location.state?.body;

    // check the previous screen
    useEffect(() => {
        if (!element) {
            navigate('/appoinment');
        }
    }, []);

    return (
        <section className="h-[calc(100vh-60px)] w-full overflow-y-auto bg-[#f6f8fc]">
            <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">

                {/* ================= HEADER ================= */}
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                            <button
                                type="button"
                                onClick={() => navigate("/appoinment")}
                                className="cursor-pointer transition hover:text-blue-600"
                            >
                                Appointments
                            </button>

                            <i className="bi bi-chevron-right text-[9px]" />

                            <span className="text-slate-500">
                                Details
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Appointment Details
                        </h1>

                        <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                            Review appointment, patient and doctor information
                        </p>
                    </div>

                    {/* ID + STATUS */}
                    <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-400 shadow-sm">
                            ID: {element?._id || "—"}
                        </span>

                        <span
                            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-bold ${element?.status?.toLowerCase() === "accepted"
                                    ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                                    : element?.status?.toLowerCase() === "pending"
                                        ? "border-amber-100 bg-amber-50 text-amber-600"
                                        : "border-red-100 bg-red-50 text-red-600"
                                }`}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {element?.status || "Unknown"}
                        </span>

                    </div>
                </div>


                {/* ================= MAIN APPOINTMENT HERO ================= */}
                <div className="relative mb-5 overflow-hidden rounded-[24px] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-5 shadow-lg sm:p-7">

                    {/* Background decoration */}
                    <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
                    <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-indigo-400/20 blur-3xl" />

                    <div className="relative">

                        <div className="mb-5 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-blue-200">
                                <i className="bi bi-calendar2-check text-sm" />
                            </div>

                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                                    Appointment
                                </p>

                                <p className="text-xs text-white/50">
                                    Scheduled consultation
                                </p>
                            </div>
                        </div>


                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                            {/* DATE */}
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-blue-200">
                                    <i className="bi bi-calendar3" />
                                </div>

                                <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                                    Date
                                </p>

                                <p className="mt-1 text-sm font-semibold text-white">
                                    {element?.appointmentDate || "—"}
                                </p>
                            </div>


                            {/* TIME */}
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-blue-200">
                                    <i className="bi bi-clock" />
                                </div>

                                <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                                    Time
                                </p>

                                <p className="mt-1 text-sm font-semibold text-white">
                                    {element?.appointmentTime || "—"}
                                </p>
                            </div>


                            {/* REASON */}
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-blue-200">
                                    <i className="bi bi-chat-left-text" />
                                </div>

                                <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                                    Reason
                                </p>

                                <p className="mt-1 line-clamp-2 text-sm font-semibold text-white">
                                    {element?.reason || "No reason provided"}
                                </p>
                            </div>

                        </div>

                    </div>
                </div>


                {/* ================= PEOPLE + BILLING ================= */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                    {/* ================= PATIENT ================= */}
                    <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="mb-5 flex items-center justify-between">

                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-500">
                                    Patient
                                </p>

                                <h2 className="mt-1 text-sm font-bold text-slate-800">
                                    Patient Details
                                </h2>
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <i className="bi bi-person" />
                            </div>

                        </div>


                        <div className="flex items-center gap-3">

                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-blue-50">
                                {element?.image ? (
                                    <img
                                        src={element.image}
                                        alt={element?.patientName || "Patient"}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-blue-500">
                                        {element?.patientName?.charAt(0)?.toUpperCase() || "P"}
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0">
                                <h3 className="truncate text-sm font-bold text-slate-800">
                                    {element?.patientName || "Unknown Patient"}
                                </h3>

                                <p className="mt-0.5 truncate text-[11px] text-slate-400">
                                    {element?.patientId || "No patient ID"}
                                </p>
                            </div>

                        </div>


                        <div className="mt-5 space-y-2">

                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                                <i className="bi bi-telephone text-xs text-slate-400" />

                                <span className="truncate text-xs text-slate-600">
                                    {element?.patientPhone || "No phone number"}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                                <i className="bi bi-envelope text-xs text-slate-400" />

                                <span className="truncate text-xs text-slate-600">
                                    {element?.patientEmail || "No email address"}
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* ================= DOCTOR ================= */}
                    <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="mb-5 flex items-center justify-between">

                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-indigo-500">
                                    Doctor
                                </p>

                                <h2 className="mt-1 text-sm font-bold text-slate-800">
                                    Doctor Details
                                </h2>
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <i className="bi bi-person-badge" />
                            </div>

                        </div>


                        <div className="flex items-center gap-3">

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-100 text-lg font-bold text-indigo-600">
                                {element?.doctorName?.charAt(0)?.toUpperCase() || "D"}
                            </div>

                            <div className="min-w-0">
                                <h3 className="truncate text-sm font-bold text-slate-800">
                                    Dr. {element?.doctorName || "Unknown Doctor"}
                                </h3>

                                <p className="mt-0.5 truncate text-[11px] text-blue-500">
                                    {element?.doctorSpeciality || "General Physician"}
                                </p>
                            </div>

                        </div>


                        <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">

                            <i className="bi bi-envelope text-xs text-slate-400" />

                            <span className="truncate text-xs text-slate-600">
                                {element?.doctorEmail || "No email address"}
                            </span>

                        </div>

                    </div>


                    {/* ================= BILLING ================= */}
                    <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="mb-5 flex items-center justify-between">

                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-500">
                                    Billing
                                </p>

                                <h2 className="mt-1 text-sm font-bold text-slate-800">
                                    Payment Details
                                </h2>
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <i className="bi bi-credit-card" />
                            </div>

                        </div>


                        <div className="flex items-end justify-between">

                            <div>
                                <p className="text-[10px] font-medium text-slate-400">
                                    Consultation Fee
                                </p>

                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    ₹{element?.fees || "0"}
                                </p>
                            </div>

                            <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${element?.paymentStatus?.toLowerCase() === "paid"
                                        ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                                        : "border-red-100 bg-red-50 text-red-500"
                                    }`}
                            >
                                {element?.paymentStatus || "Unpaid"}
                            </span>

                        </div>


                        <div className="my-4 h-px bg-slate-100" />

                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                Payment ID
                            </p>

                            <p className="mt-1 break-all text-[10px] font-medium text-slate-600">
                                {element?.paymentId || "—"}
                            </p>
                        </div>

                    </div>

                </div>


                {/* ================= FOOTER INFO ================= */}
                <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <i className="bi bi-info-circle" />
                        <span>
                            Appointment booked on{" "}
                            {element?.createdAt
                                ? new Date(element.createdAt).toLocaleString()
                                : "—"}
                        </span>
                    </div>

                    <span className="text-[10px] font-semibold text-slate-300">
                        Appointment #{element?._id?.slice(-6) || "—"}
                    </span>

                </div>

            </div>
        </section>
    );
}

export default AppoitmentDetails