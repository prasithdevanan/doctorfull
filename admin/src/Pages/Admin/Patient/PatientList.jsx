import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../../context/AdminContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PatientList() {
    const navigate = useNavigate();
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
            <section className="h-[calc(100vh-4.5rem)] w-full overflow-hidden bg-slate-50">

                <div className="flex h-full flex-col px-4 py-4 sm:px-6 lg:px-7">

                    {/* ================= HEADER ================= */}
                    <div className="mb-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Patient Management</span>
                            </div>

                            <div className="mt-1 flex items-center gap-2.5">
                                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Patients</h1>
                                <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">{String(patientList.length).padStart(2, "0")}</span>
                            </div>

                            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">Manage and review your registered patients</p>
                        </div>

                        {/* ================= TOTAL ================= */}
                        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                <i className="bi bi-people text-sm" />
                            </div>

                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Patients</p>
                                <p className="mt-0.5 text-sm font-bold text-slate-800">{String(patientList.length).padStart(2, "0")}</p>
                            </div>
                        </div>

                    </div>


                    {/* ================= CONTENT ================= */}
                    <div className="min-h-0 flex-1">

                        {loading ? (

                            /* ================= LOADING ================= */
                            <div className="flex h-full items-center justify-center">
                                <div className="flex flex-col items-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                                    </div>
                                    <p className="mt-3 text-xs font-medium text-slate-400">Loading patients...</p>
                                </div>
                            </div>

                        ) : patientList.length > 0 ? (

                            /* ================= PATIENT LIST ================= */
                            <div className="custom-scrollbar h-full overflow-y-auto pb-3 pr-1">

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">

                                    {patientList.map((patient, index) => (

                                        <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

                                            {/* ================= CARD HEADER ================= */}
                                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">

                                                <div className="flex items-center gap-2">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Patient</span>
                                                </div>

                                                <span className="text-[9px] font-semibold text-slate-300">#{String(index + 1).padStart(2, "0")}</span>

                                            </div>


                                            {/* ================= CARD BODY ================= */}
                                            <div className="p-4">

                                                {/* PROFILE */}
                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-sm font-bold text-slate-500">

                                                        {patient.image ? (
                                                            <img src={patient.image} alt={patient.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            patient.name?.charAt(0)?.toUpperCase() || "P"
                                                        )}

                                                    </div>

                                                    <div className="min-w-0">
                                                        <h2 className="truncate text-sm font-bold text-slate-800">{patient.name || "Unknown Patient"}</h2>

                                                        <div className="mt-1 flex min-w-0 items-center gap-1.5">
                                                            <i className="bi bi-envelope shrink-0 text-[9px] text-slate-300" />
                                                            <p className="truncate text-[10px] text-slate-400">{patient.email || "No email available"}</p>
                                                        </div>
                                                    </div>

                                                </div>


                                                {/* ================= INFORMATION ================= */}
                                                <div className="mt-4 grid grid-cols-2 gap-2">

                                                    <div className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2.5">
                                                        <div className="mb-1 flex items-center gap-1.5">
                                                            <i className="bi bi-person-vcard text-[9px] text-slate-400" />
                                                            <span className="text-[8px] font-bold uppercase tracking-wide text-slate-400">Patient ID</span>
                                                        </div>

                                                        <p className="truncate text-[10px] font-semibold text-slate-600">{patient.patientId || "—"}</p>
                                                    </div>


                                                    <div className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2.5">
                                                        <div className="mb-1 flex items-center gap-1.5">
                                                            <i className="bi bi-shield-check text-[9px] text-slate-400" />
                                                            <span className="text-[8px] font-bold uppercase tracking-wide text-slate-400">Status</span>
                                                        </div>

                                                        <p className="text-[10px] font-semibold text-emerald-600">Verified</p>
                                                    </div>

                                                </div>


                                                {/* ================= CONTACT ================= */}
                                                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-100 px-2.5 py-2.5">
                                                    <i className="bi bi-telephone text-[10px] text-slate-400" />
                                                    <span className="truncate text-[10px] text-slate-500">{patient.mobile || "No phone number"}</span>
                                                </div>


                                                {/* ================= ACTION ================= */}
                                                <button type="button" onClick={() => navigate(`/patientlist/${patient._id}`, { state: patient })} className="mt-3 flex h-9 w-full cursor-pointer items-center justify-between rounded-lg bg-slate-900 px-3.5 text-[11px] font-semibold text-white transition-colors hover:bg-blue-600 active:scale-[0.98]">

                                                    <span>View Patient</span>

                                                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/10">
                                                        <i className="bi bi-arrow-right text-[9px]" />
                                                    </span>

                                                </button>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        ) : (

                            /* ================= EMPTY ================= */
                            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">
                                    <i className="bi bi-person-x text-lg text-slate-300" />
                                </div>

                                <h2 className="mt-3 text-sm font-bold text-slate-700">No Patients Found</h2>

                                <p className="mt-1 max-w-xs text-center text-xs leading-5 text-slate-400">Patients registered in your system will appear here.</p>

                            </div>

                        )}

                    </div>

                </div>

            </section>
        </>
    )
}

export default PatientList