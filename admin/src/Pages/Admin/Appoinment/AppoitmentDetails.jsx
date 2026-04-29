import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

function AppoitmentDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const element = location.state?.body;
    console.log(element);

    // check the previous screen
    useEffect(() => {
        if (!element) {
            navigate('/appoinment');
        }
    }, []);
    return (
        <>
            <section className='w-full px-6 h-[calc(100vh-80px)] overflow-y-scroll bg-gray-50'>
                <div className='py-4'>
                    <p className='text-sm flex items-center'><span onClick={() => navigate('/appoinment')} className='text-gray-500 hover:text-(--color-primary) cursor-pointer'>Appoitment</span><i className="bi bi-arrow-right-short text-gray-500"></i><span>Details</span></p>
                </div>
                <div>
                    {/* /** Appointment Details */}
                    <div className="max-w-3xl mx-auto">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-semibold text-gray-800">
                                Appointment Details
                            </h1>
                            <span className="text-xs px-3 py-1 bg-gray-100 text-gray-500 rounded-full">
                                ID: {element?._id}
                            </span>
                        </div>

                        {/* Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                            <p className="text-xs font-medium text-gray-400 tracking-wider mb-4">
                                APPOINTMENT INFORMATION
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Date & Time</p>
                                    <p className="text-gray-800 font-medium">
                                        {element?.appointmentDate} at {element?.appointmentTime}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Consultation Reason</p>
                                    <p className="text-gray-800 font-medium">
                                        {element?.reason}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Fees & Billing</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800 font-medium">
                                            ₹{element?.fees}
                                        </span>

                                        <span
                                            className={`text-xs px-2 py-1 rounded-full text-white ${element?.paymentStatus === "paid"
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                                }`}
                                        >
                                            {element?.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Created At</p>
                                    <p className="text-gray-800 font-medium">
                                        {element?.updatedAt}
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className="grid md:grid-cols-2 gap-6 mt-6">

                        {/* Patient Details */}
                        <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Patient Details
                            </h2>

                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={element?.image}
                                    alt="profile"
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-gray-800 font-medium">
                                        {element?.patientName}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {element?.patientId}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                    <i className="bi bi-telephone text-gray-400"></i>
                                    {element?.patientPhone}
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                    <i className="bi bi-envelope text-gray-400"></i>
                                    {element?.patientEmail}
                                </div>
                            </div>
                        </section>

                        {/* Doctor Details */}
                        <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Doctor Details
                            </h2>

                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={element?.image}
                                    alt="doctor"
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-gray-800 font-medium">
                                        {element?.doctorName}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {element?.doctorSpeciality}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
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