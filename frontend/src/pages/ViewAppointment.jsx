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

        let pdfContainer = null;

        try {
            const original = pdfRef.current;
            const clone = original.cloneNode(true);

            // ==========================================
            // PDF SAFE STYLE
            // ==========================================

            const style = document.createElement("style");

            style.textContent = `
            * {
                box-sizing: border-box !important;
                color-scheme: light !important;
            }

            .pdf-safe-root {
                background: #ffffff !important;
                color: #0f172a !important;
                font-family: Arial, Helvetica, sans-serif !important;
                overflow: visible !important;
            }

            .pdf-safe-root * {
                font-family: Arial, Helvetica, sans-serif !important;
            }

            /* =========================
               BACKGROUNDS
            ========================= */

            .pdf-safe-root .bg-white {
                background-color: #ffffff !important;
            }

            .pdf-safe-root .bg-slate-50 {
                background-color: #f8fafc !important;
            }

            .pdf-safe-root .bg-slate-900 {
                background-color: #0f172a !important;
            }

            .pdf-safe-root .bg-emerald-50 {
                background-color: #ecfdf5 !important;
            }

            .pdf-safe-root .bg-emerald-100 {
                background-color: #d1fae5 !important;
            }

            .pdf-safe-root .bg-blue-50 {
                background-color: #eff6ff !important;
            }

            .pdf-safe-root .bg-blue-100 {
                background-color: #dbeafe !important;
            }

            .pdf-safe-root .bg-violet-50 {
                background-color: #f5f3ff !important;
            }

            .pdf-safe-root .bg-amber-50 {
                background-color: #fffbeb !important;
            }

            .pdf-safe-root .bg-red-50 {
                background-color: #fef2f2 !important;
            }

            /* =========================
               TEXT
            ========================= */

            .pdf-safe-root .text-white {
                color: #ffffff !important;
            }

            .pdf-safe-root .text-slate-300 {
                color: #cbd5e1 !important;
            }

            .pdf-safe-root .text-slate-400 {
                color: #94a3b8 !important;
            }

            .pdf-safe-root .text-slate-500 {
                color: #64748b !important;
            }

            .pdf-safe-root .text-slate-600 {
                color: #475569 !important;
            }

            .pdf-safe-root .text-slate-700 {
                color: #334155 !important;
            }

            .pdf-safe-root .text-slate-800 {
                color: #1e293b !important;
            }

            .pdf-safe-root .text-slate-900 {
                color: #0f172a !important;
            }

            .pdf-safe-root .text-emerald-400 {
                color: #34d399 !important;
            }

            .pdf-safe-root .text-emerald-500 {
                color: #10b981 !important;
            }

            .pdf-safe-root .text-emerald-600 {
                color: #059669 !important;
            }

            .pdf-safe-root .text-emerald-700 {
                color: #047857 !important;
            }

            .pdf-safe-root .text-blue-600 {
                color: #2563eb !important;
            }

            .pdf-safe-root .text-violet-600 {
                color: #7c3aed !important;
            }

            .pdf-safe-root .text-amber-600 {
                color: #d97706 !important;
            }

            .pdf-safe-root .text-amber-700 {
                color: #b45309 !important;
            }

            .pdf-safe-root .text-red-500 {
                color: #ef4444 !important;
            }

            .pdf-safe-root .text-red-600 {
                color: #dc2626 !important;
            }

            /* =========================
               BORDERS
            ========================= */

            .pdf-safe-root .border-slate-100 {
                border-color: #f1f5f9 !important;
            }

            .pdf-safe-root .border-slate-200 {
                border-color: #e2e8f0 !important;
            }

            .pdf-safe-root .border-emerald-200 {
                border-color: #a7f3d0 !important;
            }

            .pdf-safe-root .border-blue-200 {
                border-color: #bfdbfe !important;
            }

            /* =========================
               HEADER
            ========================= */

            .pdf-safe-root [data-pdf-header] {
                background-color: #10b981 !important;
                background-image: linear-gradient(
                    135deg,
                    #10b981,
                    #059669
                ) !important;
            }

            /* =========================
               HEADER DECORATION
            ========================= */

            .pdf-safe-root .bg-white\\/10 {
                background-color: rgba(
                    255,
                    255,
                    255,
                    0.10
                ) !important;
            }

            .pdf-safe-root .bg-white\\/5 {
                background-color: rgba(
                    255,
                    255,
                    255,
                    0.05
                ) !important;
            }

            /* =========================
               REMOVE SHADOWS
            ========================= */

            .pdf-safe-root * {
                box-shadow: none !important;
                text-shadow: none !important;
            }

            /* =========================
               REMOVE ANIMATION
            ========================= */

            .pdf-safe-root *,
            .pdf-safe-root *::before,
            .pdf-safe-root *::after {
                transition: none !important;
                animation: none !important;
            }

            /* =========================
               HIDE WEBSITE ELEMENTS
            ========================= */

            .pdf-hide {
                display: none !important;
            }
        `;

            // ==========================================
            // SAFE ROOT
            // ==========================================

            clone.classList.add("pdf-safe-root");

            // ==========================================
            // HIDE BUTTONS
            // ==========================================

            clone.querySelectorAll("button").forEach((button) => {
                button.classList.add("pdf-hide");
            });

            // Hide anything explicitly marked
            clone.querySelectorAll("[data-pdf-hide]").forEach((element) => {
                element.classList.add("pdf-hide");
            });

            // ==========================================
            // REMOVE TAILWIND CSS VARIABLES
            // ==========================================

            clone.querySelectorAll("*").forEach((element) => {
                element.style.setProperty(
                    "color-scheme",
                    "light",
                    "important"
                );

                element.style.removeProperty("--tw-ring-color");
                element.style.removeProperty("--tw-shadow");
                element.style.removeProperty("--tw-shadow-colored");
                element.style.removeProperty("--tw-ring-shadow");
                element.style.removeProperty("--tw-inset-shadow");
                element.style.removeProperty("--tw-inset-ring-shadow");
                element.style.removeProperty("--tw-ring-offset-shadow");
            });

            // ==========================================
            // PDF PAGE
            // ==========================================

            const page = document.createElement("div");

            page.style.width = "718px";
            page.style.backgroundColor = "#ffffff";
            page.style.display = "flex";
            page.style.justifyContent = "center";
            page.style.alignItems = "flex-start";
            page.style.boxSizing = "border-box";
            page.style.margin = "0 auto";
            page.style.padding = "0";
            page.style.overflow = "visible";

            // ==========================================
            // PDF CONTENT WIDTH
            // ==========================================

            clone.style.width = "620px";
            clone.style.maxWidth = "620px";
            clone.style.margin = "0 auto";
            clone.style.backgroundColor = "#ffffff";
            clone.style.color = "#0f172a";
            clone.style.overflow = "visible";

            // ==========================================
            // PDF CONTAINER
            // ==========================================

            pdfContainer = document.createElement("div");

            pdfContainer.style.position = "fixed";
            pdfContainer.style.left = "-100000px";
            pdfContainer.style.top = "0";
            pdfContainer.style.width = "718px";
            pdfContainer.style.backgroundColor = "#ffffff";
            pdfContainer.style.zIndex = "-999999";
            pdfContainer.style.color = "#0f172a";
            pdfContainer.style.overflow = "visible";

            // ==========================================
            // APPEND
            // ==========================================

            page.appendChild(clone);

            pdfContainer.appendChild(style);
            pdfContainer.appendChild(page);

            document.body.appendChild(pdfContainer);

            // ==========================================
            // WAIT FOR FONTS
            // ==========================================

            if (document.fonts?.ready) {
                await document.fonts.ready;
            }

            // ==========================================
            // WAIT FOR IMAGES
            // ==========================================

            const images = clone.querySelectorAll("img");

            await Promise.all(
                [...images].map((img) => {
                    if (img.complete) {
                        return Promise.resolve();
                    }

                    return new Promise((resolve) => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                })
            );

            // ==========================================
            // SMALL RENDER DELAY
            // ==========================================

            await new Promise((resolve) => {
                setTimeout(resolve, 500);
            });

            // ==========================================
            // GENERATE PDF
            // ==========================================

            await html2pdf()
                .set({
                    margin: [10, 10, 10, 10],

                    filename: `appointment_${appointment?._id || "details"}.pdf`,

                    image: {
                        type: "jpeg",
                        quality: 0.98,
                    },

                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        allowTaint: false,
                        backgroundColor: "#ffffff",
                        logging: false,

                        onclone: (documentClone) => {
                            documentClone
                                .querySelectorAll("*")
                                .forEach((element) => {
                                    element.style.setProperty(
                                        "color-scheme",
                                        "light",
                                        "important"
                                    );
                                });
                        },
                    },

                    jsPDF: {
                        unit: "mm",
                        format: "a4",
                        orientation: "portrait",
                    },
                })
                .from(page)
                .save();

        } catch (error) {
            console.error(
                "PDF generation failed:",
                error
            );

            alert(
                "Unable to generate the appointment PDF. Please try again."
            );

        } finally {
            if (
                pdfContainer &&
                pdfContainer.parentNode
            ) {
                pdfContainer.parentNode.removeChild(
                    pdfContainer
                );
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