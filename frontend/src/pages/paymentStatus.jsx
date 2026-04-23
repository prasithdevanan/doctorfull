import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location?.state)


    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">

                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-green-100 text-green-600 rounded-full p-4 text-3xl">
                        ✓
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Payment Successful
                </h2>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    Your payment has been processed successfully. Thank you for choosing Metix.
                </p>

                {/* Optional Details */}
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 mb-6">
                    <p><span className="font-semibold">Transaction ID:</span> 123456789</p>
                    <p><span className="font-semibold">Amount:</span> ₹500</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
                    >
                        Go to Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="border border-gray-300 hover:bg-gray-100 py-2 rounded-lg transition"
                    >
                        Back to Home
                    </button>
                </div>

            </div>
        </div>
    );
}

export default PaymentSuccess;