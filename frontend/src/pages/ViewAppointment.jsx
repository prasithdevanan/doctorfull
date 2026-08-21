import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";

function AppointmentView() {
    const navigate = useNavigate();
    const location = useLocation();
    const pdfRef = useRef();

    const appointment = location?.state;

    // =========================
    // Prevent back navigation
    // =========================
    useEffect(() => {
        if (!appointment) return;

        const handleBack = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handleBack);

        return () => {
            window.removeEventListener("popstate", handleBack);
        };
    }, [appointment]);

    // =========================
    // No appointment
    // =========================
    if (!appointment) {
        return (
            <section className="min-h-[calc(100vh-82px)] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-4">

                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <i className="bi bi-calendar-x text-3xl"></i>
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-800">
                        Appointment Not Found
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        We couldn't find the appointment details. Please return to your appointments and try again.
                    </p>

                    <button
                        onClick={() => navigate("/appointment")}
                        className="mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back to Appointments
                    </button>

                </div>

            </section>
        );
    }

    // =========================
    // Appointment values
    // =========================
    const appointmentStatus =
        appointment.appointmentStatus === "Upcoming"
            ? appointment.status
            : appointment.appointmentStatus;

    const statusText =
        appointment.status?.toLowerCase() === "pending"
            ? "Pending"
            : appointmentStatus;

    const isUpcoming =
        appointment.appointmentStatus === "Upcoming";

    const paymentStatus =
        appointment.paymentStatus?.toLowerCase() === "paid";

    // =========================
    // Download PDF
    // =========================
    const handleDownload = async () => {
        if (!pdfRef.current) return;

        let container;

        try {
            // Clone the content
            const clone = pdfRef.current.cloneNode(true);

            // ---------------------------------------
            // Create a fixed desktop-size PDF wrapper
            // ---------------------------------------
            container = document.createElement("div");

            Object.assign(container.style, {
                position: "absolute",
                left: "-100000px",
                top: "0",
                width: "700px",
                minWidth: "700px",
                maxWidth: "700px",
                padding: "0",
                margin: "0",
                background: "#ffffff",
                overflow: "visible",
                display: "block",
            });

            // ---------------------------------------
            // Force the cloned content to desktop size
            // ---------------------------------------
            Object.assign(clone.style, {
                width: "700px",
                minWidth: "700px",
                maxWidth: "700px",
                margin: "0",
                padding: "0",
                backgroundColor: "#ffffff",
                boxSizing: "border-box",
                display: "block",
            });

            // Hide buttons
            clone.querySelectorAll("button").forEach((el) => {
                el.style.display = "none";
            });

            // Prevent mobile responsive styles from shrinking things
            clone.querySelectorAll("*").forEach((el) => {
                el.style.boxSizing = "border-box";
            });

            container.appendChild(clone);
            document.body.appendChild(container);

            // ---------------------------------------
            // Wait for fonts
            // ---------------------------------------
            if (document.fonts?.ready) {
                await document.fonts.ready;
            }

            // ---------------------------------------
            // Wait for images
            // ---------------------------------------
            const images = [...clone.querySelectorAll("img")];

            await Promise.all(
                images.map((img) => {
                    if (img.complete && img.naturalWidth > 0) {
                        return Promise.resolve();
                    }

                    return new Promise((resolve) => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                })
            );

            // ---------------------------------------
            // Wait for browser layout
            // ---------------------------------------
            await new Promise((resolve) => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(resolve);
                });
            });

            // ---------------------------------------
            // Generate PDF
            // ---------------------------------------
            await html2pdf()
                .set({
                    margin: [10, 10, 10, 10],

                    filename: `appointment_${appointment?._id || "details"
                        }.pdf`,

                    image: {
                        type: "jpeg",
                        quality: 0.95,
                    },

                    html2canvas: {
                        scale: 2,

                        useCORS: true,

                        allowTaint: false,

                        backgroundColor: "#ffffff",

                        // IMPORTANT:
                        // Force html2canvas to use desktop dimensions
                        windowWidth: 1440,
                        windowHeight: 2000,

                        scrollX: 0,
                        scrollY: 0,

                        logging: false,
                    },

                    jsPDF: {
                        unit: "mm",
                        format: "a4",
                        orientation: "portrait",
                        compress: true,
                    },

                    pagebreak: {
                        mode: ["css", "legacy"],
                    },
                })
                .from(clone)
                .save();

        } catch (error) {
            console.error("PDF generation failed:", error);

            alert(
                "Unable to generate the appointment PDF. Please try again."
            );

        } finally {
            if (container) {
                container.remove();
            }
        }
    };

    return (
        <div className="min-h-[calc(100vh-82px)] overflow-y-auto bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-3 py-4 sm:px-5 sm:py-6">

            <div
                ref={pdfRef}
                className="mx-auto w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)]"
            >

                {/* ==================================================
                    HEADER
                ================================================== */}
                <div
                    data-pdf-header
                    style={{
                        backgroundImage:
                            "linear-gradient(to bottom right, rgb(16,185,129), rgb(5,150,105))",
                    }}
                    className="relative overflow-hidden px-5 py-6 text-white sm:px-8 sm:py-7"
                >

                    <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/10"></div>

                    <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5"></div>

                    <div className="relative">

                        {/* Back */}
                        <button
                            data-pdf-hide
                            onClick={() => navigate("/appointment")}
                            className="mb-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/20"
                        >
                            <i className="bi bi-arrow-left"></i>
                            Appointments
                        </button>

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            {/* Doctor */}
                            <div className="flex items-center gap-4">

                                <img
                                    src={appointment.image}
                                    alt={appointment.doctorName}
                                    crossOrigin="anonymous"
                                    className="h-16 w-16 rounded-2xl border-2 border-white/30 bg-white object-cover sm:h-20 sm:w-20"
                                />

                                <div>

                                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-50">
                                        Appointment Details
                                    </p>

                                    <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                                        Dr. {appointment.doctorName}
                                    </h1>

                                    <p className="mt-1 text-xs text-emerald-50 sm:text-sm">
                                        {appointment.doctorSpeciality}
                                    </p>

                                </div>

                            </div>


                            {/* Status */}
                            <div className="flex items-center gap-2 self-start rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:self-center">

                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>

                                {statusText}

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    BODY
                ================================================== */}
                <div className="p-4 sm:p-6 md:p-7">

                    {/* =========================
                        APPOINTMENT SUMMARY
                    ========================= */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                        {/* Date */}
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <i className="bi bi-calendar-event"></i>
                            </div>

                            <p className="mt-3 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                Date
                            </p>

                            <p className="mt-1 text-xs font-bold text-slate-800 sm:text-sm">
                                {appointment.appointmentDate}
                            </p>

                        </div>


                        {/* Time */}
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                <i className="bi bi-clock"></i>
                            </div>

                            <p className="mt-3 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                Time
                            </p>

                            <p className="mt-1 text-xs font-bold text-slate-800 sm:text-sm">
                                {appointment.appointmentTime}
                            </p>

                        </div>


                        {/* Fee */}
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <i className="bi bi-currency-rupee"></i>
                            </div>

                            <p className="mt-3 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                Consultation
                            </p>

                            <p className="mt-1 text-xs font-bold text-slate-800 sm:text-sm">
                                ₹ {Number(appointment.fees || 0).toLocaleString("en-IN")}
                            </p>

                        </div>


                        {/* Payment */}
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">

                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${paymentStatus ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                                <i className="bi bi-credit-card"></i>
                            </div>

                            <p className="mt-3 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                Payment
                            </p>

                            <p className={`mt-1 text-xs font-bold sm:text-sm ${paymentStatus ? "text-emerald-600" : "text-amber-600"}`}>
                                {paymentStatus ? "Paid" : "Unpaid"}
                            </p>

                        </div>

                    </div>


                    {/* =========================
                        PATIENT + DOCTOR
                    ========================= */}
                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* Patient */}
                        <div className="rounded-2xl border border-slate-100 bg-white">

                            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <i className="bi bi-person-fill text-lg"></i>
                                </div>

                                <div>

                                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                        Patient
                                    </p>

                                    <h2 className="text-sm font-bold text-slate-800">
                                        {appointment.patientName}
                                    </h2>

                                </div>

                            </div>


                            <div className="divide-y divide-slate-100">

                                <div className="flex items-center justify-between gap-3 px-4 py-3">

                                    <span className="text-xs text-slate-400">
                                        Patient ID
                                    </span>

                                    <span className="text-xs font-semibold text-slate-700">
                                        {appointment.patientId}
                                    </span>

                                </div>

                                <div className="flex items-center justify-between gap-3 px-4 py-3">

                                    <span className="text-xs text-slate-400">
                                        Email
                                    </span>

                                    <span className="max-w-[65%] truncate text-right text-xs font-medium text-slate-700">
                                        {appointment.patientEmail}
                                    </span>

                                </div>

                                <div className="flex items-center justify-between gap-3 px-4 py-3">

                                    <span className="text-xs text-slate-400">
                                        Phone
                                    </span>

                                    <span className="text-xs font-medium text-slate-700">
                                        {appointment.patientPhone}
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* Doctor */}
                        <div className="rounded-2xl border border-slate-100 bg-white">

                            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                    <i className="bi bi-heart-pulse text-lg"></i>
                                </div>

                                <div>

                                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                        Healthcare Provider
                                    </p>

                                    <h2 className="text-sm font-bold text-slate-800">
                                        Dr. {appointment.doctorName}
                                    </h2>

                                </div>

                            </div>


                            <div className="divide-y divide-slate-100">

                                <div className="flex items-center justify-between gap-3 px-4 py-3">

                                    <span className="text-xs text-slate-400">
                                        Speciality
                                    </span>

                                    <span className="text-xs font-semibold text-slate-700">
                                        {appointment.doctorSpeciality}
                                    </span>

                                </div>

                                <div className="flex items-center justify-between gap-3 px-4 py-3">

                                    <span className="text-xs text-slate-400">
                                        Doctor ID
                                    </span>

                                    <span className="max-w-[60%] truncate text-right text-[10px] font-medium text-slate-700">
                                        {appointment.doctorId}
                                    </span>

                                </div>

                                <div className="flex items-center justify-between gap-3 px-4 py-3">

                                    <span className="text-xs text-slate-400">
                                        Doctor Email
                                    </span>

                                    <span className="max-w-[60%] truncate text-right text-xs font-medium text-slate-700">
                                        {appointment.doctorEmail}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        REASON
                    ========================= */}
                    <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">

                        <div className="flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                                <i className="bi bi-chat-left-medical text-lg"></i>
                            </div>

                            <div className="min-w-0">

                                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                    Reason for Visit
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-700">
                                    {appointment.reason}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        APPOINTMENT ID
                    ========================= */}
                    <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-2">

                            <i className="bi bi-receipt text-slate-400"></i>

                            <span className="text-xs font-medium text-slate-500">
                                Appointment ID
                            </span>

                        </div>

                        <span className="break-all text-xs font-semibold text-slate-700 sm:text-right">
                            {appointment._id}
                        </span>

                    </div>
                    <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-2">

                            <i className="bi bi-receipt text-slate-400"></i>

                            <span className="text-xs font-medium text-slate-500">
                                Payment ID
                            </span>

                        </div>

                        <span className="break-all text-xs font-semibold text-slate-700 sm:text-right">
                            {appointment.paymentId}
                        </span>

                    </div>


                    {/* =========================
                        ACTION BUTTONS
                    ========================= */}
                    <div
                        data-pdf-hide
                        className="w-full mt-10"
                    >

                        <button
                            onClick={handleDownload}
                            className={`flex cursor-pointer items-center mx-auto justify-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700 transition-all duration-200 hover:bg-amber-100 sm:text-sm ${!isUpcoming ? "sm:col-span-2" : ""}`}
                        >
                            <i className="bi bi-download"></i>
                            Download Appointment
                        </button>

                    </div>


                    {/* =========================
                        FOOTER
                    ========================= */}
                    <div className="mt-5 text-center">

                        <p className="text-[9px] text-slate-400 sm:text-[10px]">
                            Thank you for choosing Metix Healthcare
                        </p>

                        <div className="mt-1 flex items-center justify-center gap-1 text-[9px] text-slate-300">
                            <i className="bi bi-shield-lock"></i>
                            Secure appointment details
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AppointmentView;