import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../../context/AdminContext';
import axios from 'axios';

function PatientList() {
    const { BackendUrl } = useContext(AdminContext);
    const [patientList, setPatientList] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        const fatchPatient = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${BackendUrl}/api/patient/list`);
                if (!res.data.success) {
                    return console.log(res.data.message);
                }
                setPatientList(res.data.patientsList.map((patient) => ({
                    ...patient, name: patient.email.split('@')[0].charAt(0).toUpperCase() + patient.email.split('@')[0].slice(1)
                })));
                console.log(res.data.patientsList);

            } catch (error) {
                console.log(error?.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        }
        fatchPatient();
    }, [BackendUrl]);
    return (
        <>
            <section className="px-4 sm:px-6 py-6 w-full">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Appointments
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage all patient appointments
                    </p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="w-full h-[60vh] flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-(--color-primary) border-t-2 border-b-2 rounded-full animate-spin"></div>
                        <h1 className="mt-3 text-gray-600 text-sm">Loading...</h1>
                    </div>
                ) : (
                    /* Grid Layout */
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {patientList.map((patient, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-4"
                            >
                                {/* ID Badge */}
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                                        ID: {patient.patientId}
                                    </span>
                                </div>

                                {/* Name */}
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {patient.name}
                                </h2>

                                {/* Email */}
                                <p className="text-sm text-gray-500 mt-1 break-all">
                                    {patient.email}
                                </p>

                                {/* Optional footer */}
                                <div className="mt-4 flex justify-end">
                                    <button className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
                                        View
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    )
}

export default PatientList