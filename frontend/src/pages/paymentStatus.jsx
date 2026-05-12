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

    useEffect(() => {
        setOrderId(element?.body?.razorpay_payment_id || "");
        setAmount(element?.amount || "");
    }, [element]);

    // Download PDF
    const handleDownload = () => {

        html2pdf(pdfRef.current, {
            margin: [10, 40, 10, 40],

            filename: "payment_receipt.pdf",

            image: {
                type: "jpeg",
                quality: 0.98,
            },

            html2canvas: {
                scale: 2,
            },

            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait",
            },
        });
    };

    return (
        <div className="flex items-center justify-center bg-[#f0fdf4] px-4 h-[calc(100vh-82px)] py-10">
            <div
                ref={pdfRef}
                className="bg-[#ffffff] shadow-xl rounded-3xl p-8 max-w-md w-full text-center border border-[#f3f4f6]"
            >
                {/* Success Icon */}
                <div className="flex justify-center mb-5">
                    <div className="bg-[#dcfce7] text-[#16a34a] rounded-full p-4 text-4xl">
                        <i className="bi bi-check-circle-fill"></i>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-[#1f2937] mb-3">
                    Payment Successful
                </h2>

                {/* Description */}
                <p className="text-[#6b7280] mb-6 leading-relaxed">
                    Your payment has been processed successfully.
                    Thank you for choosing Metix.
                </p>

                {/* Details */}
                <div className="bg-[#f9fafb] rounded-2xl p-5 text-sm text-[#374151] mb-6 space-y-3 text-left">
                    <div className="flex justify-between gap-4">
                        <span className="font-semibold">Transaction ID</span>
                        <span className="break-all text-right">{orderId}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-semibold">Amount</span>
                        <span>₹ {amount}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-semibold">Status</span>
                        <span className="text-[#16a34a] font-medium">
                            Paid
                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/appointment")}
                        className="bg-[#22c55e] hover:bg-[#16a34a] text-white py-3 rounded-xl transition-all duration-300 cursor-pointer"
                    >
                        View Appointment
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="border border-[#d1d5db] hover:bg-[#f3f4f6] py-3 rounded-xl transition-all duration-300 cursor-pointer"
                    >
                        Back to Home
                    </button>

                    <button
                        onClick={handleDownload}
                        className="bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] py-3 rounded-xl transition-all duration-300 cursor-pointer"
                    >
                        Download Receipt
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccess;