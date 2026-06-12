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
        <>
            <section className="w-full px-6 py-6 h-[calc(100vh-80px)] overflow-y-auto bg-gray-50">

                {/* Breadcrumb */}
                <div className="py-3 mb-4">
                    <p className="text-xs flex items-center gap-2 text-gray-400">
                        <span
                            onClick={() => navigate('/appoinment')}
                            className="cursor-pointer hover:text-blue-600 transition"
                        >
                            Appointment
                        </span>

                        <i className="bi bi-chevron-right text-gray-300"></i>

                        <span className="text-gray-600">Details</span>
                    </p>
                </div>

                {/* Main container */}
                <div className="max-w-3xl mx-auto space-y-6">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-800">
                            Appointment Details
                        </h1>

                        <span className="text-[11px] px-3 py-1 bg-white border border-gray-200 text-gray-500 rounded-full">
                            ID: {element?._id}
                        </span>
                    </div>

                    {/* Appointment Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                        <p className="text-[11px] font-semibold text-gray-400 tracking-widest mb-4">
                            APPOINTMENT INFO
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <p className="text-xs text-gray-400 mb-1">Date & Time</p>
                                <p className="text-sm font-medium text-gray-800">
                                    {element?.appointmentDate} • {element?.appointmentTime}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 mb-1">Consultation Reason</p>
                                <p className="text-sm font-medium text-gray-800">
                                    {element?.reason}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 mb-1">Fees & Billing</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-800">
                                        ₹{element?.fees}
                                    </span>

                                    <span
                                        className={`text-[11px] px-2 py-1 rounded-full border font-medium
              ${element?.paymentStatus === "paid"
                                                ? "bg-green-50 text-green-600 border-green-100"
                                                : "bg-red-50 text-red-600 border-red-100"
                                            }`}
                                    >
                                        {element?.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 mb-1">Booked At</p>
                                <p className="text-sm font-medium text-gray-800">
                                    {new Date(element?.createdAt).toLocaleString()}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Patient + Doctor Grid */}
                    <div className="grid md:grid-cols-2 gap-6">

                        {/* Patient Card */}
                        <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                            <h2 className="text-sm font-semibold text-gray-700 mb-4">
                                Patient Details
                            </h2>

                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={element?.image}
                                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                />

                                <div>
                                    <h3 className="text-sm font-medium text-gray-800">
                                        {element?.patientName}
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        {element?.patientId}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                    <i className="bi bi-telephone text-gray-400"></i>
                                    {element?.patientPhone}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                    <i className="bi bi-envelope text-gray-400"></i>
                                    {element?.patientEmail}
                                </div>
                            </div>
                        </section>

                        {/* Doctor Card */}
                        <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                            <h2 className="text-sm font-semibold text-gray-700 mb-4">
                                Doctor Details
                            </h2>

                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={element?.image}
                                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                />

                                <div>
                                    <h3 className="text-sm font-medium text-gray-800">
                                        {element?.doctorName}
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        {element?.doctorSpeciality}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                <i className="bi bi-envelope text-gray-400"></i>
                                {element?.doctorEmail}
                            </div>
                        </section>

                    </div>
                </div>
            </section>
        </>
    )
}

export default AppoitmentDetails