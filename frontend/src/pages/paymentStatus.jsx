import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";

function PaymentSuccess() {
    // Prevent back navigation

    const pdfRef = useRef();

    useEffect(() => {
        const handleBack = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.history.pushState(null, "", window.location.href);

        window.addEventListener("popstate", handleBack);

        return () => {
            window.removeEventListener("popstate", handleBack);
        };
    }, []);

    // Navigation
    const navigate = useNavigate();

    // Location state
    const location = useLocation();
    const element = location?.state;

    const [orderId, setOrderId] = useState("");
    const [amount, setAmount] = useState("");
    const [patientName, setPatientName] = useState("");
    const [patientEmail, setPatientEmail] = useState("");
    const [patientPhone, setPatientPhone] = useState("");

    useEffect(() => {
        setOrderId(element?.body?.razorpay_payment_id || "Transaction ID not found");
        setAmount(element?.amount != null ? element.amount / 100 : 0);
        setPatientName(element?.name || "Name not found");
        setPatientEmail(element?.email || "Email not found");
        setPatientPhone(element?.phone || "Phone not found");
    }, [element]);

    // Download PDF
    const handleDownload = async () => {
        if (!pdfRef.current) return;

        let container = null;

        try {
            const clone = pdfRef.current.cloneNode(true);

            // Hide buttons in PDF
            clone.querySelectorAll("button").forEach((button) => {
                button.style.display = "none";
            });

            // Create PDF container
            container = document.createElement("div");

            Object.assign(container.style, {
                position: "fixed",
                left: "-10000px",
                top: "0",
                width: "794px",
                minWidth: "794px",
                background: "#ffffff",
                padding: "0",
                margin: "0",
                zIndex: "-9999",
            });

            // Force receipt to desktop width
            Object.assign(clone.style, {
                width: "700px",
                minWidth: "700px",
                maxWidth: "700px",
                margin: "0 auto",
                backgroundColor: "#ffffff",
                boxSizing: "border-box",
            });

            // Remove responsive problems
            clone.querySelectorAll("*").forEach((element) => {
                element.style.boxSizing = "border-box";
            });

            container.appendChild(clone);
            document.body.appendChild(container);

            // Wait for fonts
            if (document.fonts?.ready) {
                await document.fonts.ready;
            }

            // Wait for images
            const images = [...clone.querySelectorAll("img")];

            await Promise.all(
                images.map((img) => {
                    if (img.complete) {
                        return Promise.resolve();
                    }

                    return new Promise((resolve) => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                })
            );

            // Wait for layout
            await new Promise((resolve) => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(resolve);
                });
            });

            // Generate PDF
            await html2pdf()
                .set({
                    margin: 10,

                    filename: `payment_receipt_${orderId || "receipt"
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
                        logging: false,

                        windowWidth: 1440,
                        scrollX: 0,
                        scrollY: 0,
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
                "Unable to generate the payment receipt PDF. Please try again."
            );
        } finally {
            if (container) {
                container.remove();
            }
        }
    };


    return (
        <div className="flex min-h-[calc(100vh-82px)] items-center justify-center overflow-y-auto bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-3 py-6 sm:px-5 sm:py-8">

            <div
                ref={pdfRef}
                className="w-full max-w-lg overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)]"
            >
                {/* ================= HEADER ================= */}
                <div
                    data-pdf-header
                    style={{
                        backgroundImage:
                            "linear-gradient(to bottom right, rgb(16,185,129), rgb(5,150,105))",
                    }}
                    className="relative overflow-hidden px-5 py-7 text-center text-white sm:px-8 sm:py-8"
                >

                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10"></div>
                    <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5"></div>

                    <div className="relative">

                        {/* Success Icon */}
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg sm:h-20 sm:w-20">

                            <i className="bi bi-check-lg text-4xl font-bold text-emerald-500 sm:text-5xl"></i>

                        </div>

                        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                            Payment Successful
                        </h1>

                        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-emerald-50 sm:text-sm">
                            Your payment has been successfully processed and your appointment is confirmed.
                        </p>

                    </div>

                </div>


                {/* ================= RECEIPT BODY ================= */}
                <div className="p-4 sm:p-6 md:p-7">

                    {/* Receipt Label */}
                    <div className="mb-5 flex items-center justify-between">

                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:text-[10px]">
                                Payment Receipt
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Metix Healthcare
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold text-emerald-700 sm:text-[10px]">

                            <i className="bi bi-shield-check"></i>

                            Paid

                        </div>

                    </div>


                    {/* ================= PATIENT ================= */}
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">

                        <div className="mb-4 flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                                <i className="bi bi-person-fill text-lg"></i>

                            </div>

                            <div>
                                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                    Patient Details
                                </p>

                                <h2 className="mt-0.5 text-base font-bold text-slate-900 sm:text-lg">
                                    {patientName}
                                </h2>
                            </div>

                        </div>


                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                            {/* Email */}
                            <div className="min-w-0">

                                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                    Email
                                </p>

                                <p className="mt-1 truncate text-xs font-medium text-slate-700 sm:text-sm">
                                    {patientEmail}
                                </p>

                            </div>


                            {/* Phone */}
                            <div>

                                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                    Phone
                                </p>

                                <p className="mt-1 text-xs font-medium text-slate-700 sm:text-sm">
                                    {patientPhone}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ================= PAYMENT DETAILS ================= */}
                    <div className="mt-4">

                        <div className="mb-3 flex items-center gap-2">

                            <i className="bi bi-receipt text-sm text-slate-400"></i>

                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                Transaction Details
                            </h2>

                        </div>


                        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100">

                            {/* Transaction */}
                            <div className="flex items-start justify-between gap-4 px-4 py-3.5">

                                <div className="flex items-center gap-2.5">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                        <i className="bi bi-hash text-xs"></i>
                                    </div>

                                    <span className="text-xs font-medium text-slate-500">
                                        Transaction ID
                                    </span>

                                </div>

                                <span className="max-w-[55%] break-all text-right text-[10px] font-semibold text-slate-800 sm:text-xs">
                                    {orderId}
                                </span>

                            </div>


                            {/* Amount */}
                            <div className="flex items-center justify-between gap-4 px-4 py-3.5">

                                <div className="flex items-center gap-2.5">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                        <i className="bi bi-currency-rupee text-xs"></i>
                                    </div>

                                    <span className="text-xs font-medium text-slate-500">
                                        Amount Paid
                                    </span>

                                </div>

                                <span className="text-lg font-bold text-emerald-600 sm:text-xl">
                                    ₹ {Number(amount || 0).toLocaleString("en-IN")}
                                </span>

                            </div>


                            {/* Status */}
                            <div className="flex items-center justify-between gap-4 px-4 py-3.5">

                                <div className="flex items-center gap-2.5">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <i className="bi bi-check-circle text-xs"></i>
                                    </div>

                                    <span className="text-xs font-medium text-slate-500">
                                        Payment Status
                                    </span>

                                </div>

                                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">

                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>

                                    Successful

                                </span>

                            </div>

                        </div>

                    </div>


                    {/* ================= TOTAL ================= */}
                    <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-white sm:p-5">

                        <div className="flex items-center justify-between gap-4">

                            <div>

                                <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-slate-400">
                                    Total Paid
                                </p>

                                <p className="mt-1 text-2xl font-bold sm:text-3xl">
                                    ₹ {Number(amount || 0).toLocaleString("en-IN")}
                                </p>

                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 sm:h-12 sm:w-12">

                                <i className="bi bi-wallet2 text-xl"></i>

                            </div>

                        </div>

                    </div>


                    {/* ================= BUTTONS ================= */}
                    <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">

                        <button
                            onClick={() => navigate("/appointment")}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md sm:text-sm"
                        >
                            <i className="bi bi-calendar-check"></i>
                            View Appointment
                        </button>

                        <button
                            onClick={handleDownload}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700 transition-all duration-200 hover:bg-amber-100 sm:text-sm"
                        >
                            <i className="bi bi-download"></i>
                            Download Receipt
                        </button>

                    </div>


                    <button
                        onClick={() => navigate("/")}
                        className="mt-2.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 sm:text-sm"
                    >
                        <i className="bi bi-house"></i>
                        Back to Home
                    </button>


                    {/* Footer */}
                    <div className="mt-5 text-center">

                        <p className="text-[9px] text-slate-400 sm:text-[10px]">
                            Thank you for choosing Metix Healthcare
                        </p>

                        <div className="mt-1 flex items-center justify-center gap-1 text-[9px] text-slate-300">
                            <i className="bi bi-shield-lock"></i>
                            Secure digital receipt
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default PaymentSuccess;