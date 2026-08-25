import React, { useEffect, useContext, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { AdminContext } from '../../../context/AdminContext';
import axios from 'axios';

function PatientDetails() {
  const { BackendUrl } = useContext(AdminContext);
  const { id } = useParams();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  ///store the data
  const element = location.state;

  //check the previose page
  useEffect(() => {
    if (!element) {
      window.location.href = "/";
    }
  }, [])

  // fetch the patient appointment details

  useEffect(() => {

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BackendUrl}/api/patient/appointment/patient`, { params: { patientEmail: element.email } });
        if (!res.data.success) {
          console.log(res.data.message);
          return;
        }
        setAppointments(res.data.appointments);
      } catch (error) {
        console.log(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }

    }
    if (element) {
      fetch();
    }

  }, [element]);

  return (
    <>
      <section className="h-[calc(100vh-100px)] md:h-[calc(100vh-80px)] w-full lg:overflow-hidden bg-[#f5f7fb]">

        <div className="flex h-full flex-col px-3 py-4 sm:px-5 lg:px-7 overflow-auto">

          {/* ================= PAGE HEADER ================= */}
          <div className="mb-4 flex shrink-0 items-center justify-between">

            <div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-900 hover:text-white"
                >
                  <i className="bi bi-arrow-left text-xs" />
                </button>

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                  Patient Profile
                </span>
              </div>

              <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Patient Details
              </h1>
            </div>

            <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-600 sm:block">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active Patient
            </span>

          </div>


          {/* ================= MAIN ================= */}
          <div className="md:min-h-0 flex-1">

            <div className="flex h-full flex-col gap-4 lg:flex-row">


              {/* ================= PATIENT PROFILE ================= */}
              <aside className="shrink-0 lg:w-[290px] xl:w-[320px]">

                <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm h-full">

                  {/* PROFILE COVER */}
                  <div className="relative h-24 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600">

                    <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl" />
                    <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-indigo-400/20 blur-2xl" />

                    <span className="absolute left-5 top-4 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[9px] font-semibold text-white backdrop-blur-md">
                      PATIENT
                    </span>

                  </div>


                  {/* AVATAR */}
                  <div className="relative px-5">

                    <div className="-mt-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-[22px] border-4 border-white bg-blue-50 text-2xl font-bold text-blue-600 shadow-lg">

                      {element.image ? (
                        <img
                          src={element.image}
                          alt="Patient"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        element.name?.charAt(0)?.toUpperCase() || "P"
                      )}

                    </div>


                    {/* NAME */}
                    <div className="mt-3">

                      <h2 className="truncate text-lg font-bold text-slate-900">
                        {element.name || "Unknown Patient"}
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Patient ID: {element.patientId || "—"}
                      </p>

                    </div>


                    {/* INFO */}
                    <div className="my-5 space-y-2.5">

                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                          <i className="bi bi-envelope text-xs" />
                        </span>

                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Email
                          </p>

                          <p className="truncate text-[11px] font-medium text-slate-700">
                            {element.email || "Not available"}
                          </p>
                        </div>

                      </div>


                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
                          <i className="bi bi-telephone text-xs" />
                        </span>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Phone
                          </p>

                          <p className="text-[11px] font-medium text-slate-700">
                            {element.phone || "Not available"}
                          </p>
                        </div>

                      </div>


                      <div className="grid grid-cols-2 gap-2">

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Gender
                          </p>

                          <p className="mt-1 text-[11px] font-semibold text-slate-700">
                            {element.gender || "—"}
                          </p>
                        </div>


                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            DOB
                          </p>

                          <p className="mt-1 truncate text-[11px] font-semibold text-slate-700">
                            {element.DOB || "—"}
                          </p>
                        </div>

                      </div>

                    </div>


                    {/* PATIENT STATUS */}
                    <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2.5">

                      <div className="flex items-center gap-2">

                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-emerald-500 shadow-sm">
                          <i className="bi bi-shield-check text-xs" />
                        </span>

                        <span className="text-[10px] font-semibold text-emerald-700">
                          Patient verified
                        </span>

                      </div>

                      <span className="h-2 w-2 rounded-full bg-emerald-500" />

                    </div>

                  </div>

                </div>

              </aside>


              {/* ================= APPOINTMENTS ================= */}
              <main className="min-h-0 flex-1">

                <div className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-white shadow-sm">

                  {/* APPOINTMENT HEADER */}
                  <div className="shrink-0 border-b border-slate-100 px-4 py-4 sm:px-5">

                    <div className="flex items-center justify-between">

                      <div>

                        <div className="flex items-center gap-2">

                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <i className="bi bi-calendar2-check text-sm" />
                          </div>

                          <div>
                            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                              Appointments
                            </h2>

                            <p className="text-[10px] text-slate-400">
                              Patient appointment history
                            </p>
                          </div>

                        </div>

                      </div>


                      <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">

                        <p className="text-lg font-bold leading-none text-slate-900">
                          {appointments.length}
                        </p>

                        <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                          Total
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* APPOINTMENTS CONTENT */}
                  <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">

                    {loading ? (

                      <div className="flex h-full items-center justify-center">

                        <div className="flex flex-col items-center gap-3">

                          <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                          <p className="text-xs text-slate-400">
                            Loading appointments...
                          </p>

                        </div>

                      </div>

                    ) : appointments.length > 0 ? (

                      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">

                        {appointments.map((item, index) => (

                          <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                          >

                            {/* STATUS ACCENT */}
                            <div
                              className={`absolute left-0 top-0 h-full w-1 ${item.status?.toLowerCase() === "pending"
                                  ? "bg-amber-400"
                                  : item.status?.toLowerCase() === "cancelled" || item.status?.toLowerCase() === "canceled"
                                    ? "bg-red-500"
                                    : "bg-emerald-500"
                                }`}
                            />


                            <div className="p-4">

                              {/* TOP */}
                              <div className="flex items-start justify-between gap-3">

                                <div className="flex min-w-0 items-center gap-3">

                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600">
                                    <i className="bi bi-person-badge text-sm" />
                                  </div>

                                  <div className="min-w-0">

                                    <h3 className="truncate text-sm font-bold text-slate-800">
                                      Dr. {item.doctorName || "Unknown"}
                                    </h3>

                                    <p className="truncate text-[10px] text-slate-400">
                                      {item.doctorSpeciality || "General"}
                                    </p>

                                  </div>

                                </div>


                                <span
                                  className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold ${item.status?.toLowerCase() === "pending"
                                      ? "border-amber-100 bg-amber-50 text-amber-600"
                                      : item.status?.toLowerCase() === "cancelled" || item.status?.toLowerCase() === "canceled"
                                        ? "border-red-100 bg-red-50 text-red-600"
                                        : "border-emerald-100 bg-emerald-50 text-emerald-600"
                                    }`}
                                >
                                  {item.status || "Unknown"}
                                </span>

                              </div>


                              {/* DATE/TIME */}
                              <div className="mt-4 grid grid-cols-2 gap-2">

                                <div className="rounded-xl bg-slate-50 p-3">

                                  <div className="flex items-center gap-1.5">
                                    <i className="bi bi-calendar3 text-[10px] text-blue-500" />

                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                      Date
                                    </span>
                                  </div>

                                  <p className="mt-1 text-[11px] font-semibold text-slate-700">
                                    {item.appointmentDate || "—"}
                                  </p>

                                </div>


                                <div className="rounded-xl bg-slate-50 p-3">

                                  <div className="flex items-center gap-1.5">
                                    <i className="bi bi-clock text-[10px] text-violet-500" />

                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                      Time
                                    </span>
                                  </div>

                                  <p className="mt-1 text-[11px] font-semibold text-slate-700">
                                    {item.appointmentTime || "—"}
                                  </p>

                                </div>

                              </div>


                              {/* REASON */}
                              <div className="mt-2 rounded-xl border border-slate-100 bg-white p-3">

                                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                  Appointment Reason
                                </p>

                                <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-600">
                                  {item.reason || "No reason provided"}
                                </p>

                              </div>


                              {/* PAYMENT */}
                              <div className="mt-2 grid grid-cols-2 gap-2">

                                <div className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5">

                                  <span className="text-[10px] text-slate-400">
                                    Fees
                                  </span>

                                  <span className="text-[11px] font-bold text-slate-700">
                                    ₹{item.fees || "0"}
                                  </span>

                                </div>


                                <div className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5">

                                  <span className="text-[10px] text-slate-400">
                                    Payment
                                  </span>

                                  <span
                                    className={`rounded-full px-2 py-1 text-[8px] font-bold ${item.paymentStatus?.toLowerCase() === "unpaid"
                                        ? "bg-red-50 text-red-600"
                                        : "bg-emerald-50 text-emerald-600"
                                      }`}
                                  >
                                    {item.paymentStatus || "—"}
                                  </span>

                                </div>

                              </div>


                              {/* FOOTER */}
                              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">

                                <span className="text-[9px] text-slate-400">
                                  Appointment #{index + 1}
                                </span>

                                {item.paymentId && (
                                  <span className="max-w-[150px] truncate text-[9px] text-slate-300">
                                    {item.paymentId}
                                  </span>
                                )}

                              </div>

                            </div>

                          </div>

                        ))}

                      </div>

                    ) : (

                      <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                          <i className="bi bi-calendar2-x text-2xl text-slate-300" />
                        </div>

                        <h3 className="mt-4 text-sm font-bold text-slate-700">
                          No Appointments
                        </h3>

                        <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                          This patient does not have any appointments yet.
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              </main>

            </div>

          </div>

        </div>

      </section>
    </>
  )
}

export default PatientDetails;