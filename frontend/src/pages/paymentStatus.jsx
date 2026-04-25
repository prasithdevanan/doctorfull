import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DownloadPdf } from "./pdf/downloadPdf";

function PaymentSuccess() {

    //handle back for the prevent the back function
    useEffect(() => {
        const handleBack = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handleBack);
        return () => window.removeEventListener("popstate", handleBack);
    }, [])

    // navigation
    const navigate = useNavigate();

    //location for the previous screen
    const location = useLocation();
    const element = location?.state;
    const [orderId, setOrderId] = useState('');
    const [amount, setAmount] = useState('');
    console.log(orderId);

    useEffect(() => {
        setOrderId(element?.body.razorpay_payment_id);
        setAmount(element?.amount);
    }, [location?.state])


    return (
        <div className="flex items-center justify-center bg-green-50 px-4 h-[calc(100vh-100px)]" id="pdf-content">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">

                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-green-100 text-green-600 rounded-full p-4 text-3xl">
                        <i className="bi bi-check-circle"></i>
                    </div>
                </div>


                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Payment Successful
                </h2>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    Your payment has been processed successfully. Thank you for choosing Metix.
                </p>

                {/* Optional Details */}
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 mb-6">
                    <p><span className="font-semibold">Transaction ID:</span>{orderId}</p>
                    <p><span className="font-semibold">Amount:</span>{amount}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/appointment")}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
                    >
                        View Appointment
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="border border-gray-300 hover:bg-gray-100 py-2 rounded-lg transition"
                    >
                        Back to Home
                    </button>
                    <div className="py-2 border border-amber-200 bg-amber-50 rounded-lg">
                        <button onClick={() => DownloadPdf()}>Print</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default PaymentSuccess;