import React, { useEffect, useState, useContext } from "react";
import { AdminContext } from "../../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Appoiment() {
  const navigate = useNavigate();
  const { BackendUrl, dToken } = useContext(AdminContext);
  const [dEmail, setDEmail] = useState(localStorage.getItem("dEmail") || "");
  const [appointentsFilter, setAppointentsFilter] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(8); // items per page
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  document.title = "Appointments";
  // Fetch with pagination + search + doctor filter
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${BackendUrl}/api/admin/appointment`,
          {
            params: {
              doctorEmail: dEmail,
              search: search,
              page: page,
              limit: limit,
            },
          }
        );
        setAppointentsFilter(res.data.appointments);
        setAppointments(res.data.appointments);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BackendUrl, dToken, search, page, limit]);

  const handleFilter = (filter) => {
    const filteredAppointments = appointentsFilter.filter((appointment) => {
      if (filter === "All") {
        return appointment;
      } else if (filter === "Pending") {
        return appointment.status === "pending";
      } else if (filter === "Accepted") {
        return appointment.status === "Accepted";
      } else if (filter === "Rejected") {
        return appointment.status === "Rejected";
      }
    })
    setAppointments(filteredAppointments);
  }

  return (
    <section className="h-[calc(100vh-56px)] w-full overflow-hidden bg-[#f7f9fc]">

      <div className="flex h-full flex-col px-4 py-4 sm:px-6 lg:px-7">

        {/* ================= HEADER ================= */}
        <div className="shrink-0">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* TITLE */}
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                  Patient Management
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Appointments
              </h1>

              <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                View and manage scheduled patient appointments
              </p>
            </div>

            {/* SEARCH */}
            <div className="relative w-full lg:w-72">

              <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 sm:text-sm"
              />

            </div>

          </div>


          {/* ================= FILTER / SUMMARY ================= */}
          <div className="mt-5 flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">

            {/* FILTERS */}
            <div className="flex max-w-full items-center gap-1 overflow-x-auto">

              {[
                {
                  label: "All",
                  value: "All",
                  icon: "bi-grid",
                },
                {
                  label: "Approved",
                  value: "Accepted",
                  icon: "bi-check2-circle",
                },
                {
                  label: "Pending",
                  value: "Pending",
                  icon: "bi-clock",
                },
                {
                  label: "Rejected",
                  value: "Rejected",
                  icon: "bi-x-circle",
                },
              ].map((filter) => {

                const active = statusFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => {
                      setStatusFilter(filter.value);
                      handleFilter(filter.value);
                      setPage(1);
                    }}
                    className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition sm:text-xs ${active
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:bg-white hover:text-slate-800"
                      }`}
                  >
                    <i className={`bi ${filter.icon} text-[11px]`} />
                    {filter.label}
                  </button>
                );
              })}

            </div>


            {/* COUNT */}
            <div className="flex shrink-0 items-center gap-2 text-[11px] text-slate-400 sm:text-xs">

              <span className="font-semibold text-slate-700">
                {appointments.length}
              </span>

              <span>
                appointment{appointments.length !== 1 ? "s" : ""}
              </span>

            </div>

          </div>

        </div>


        {/* ================= CONTENT ================= */}
        <div className="min-h-0 flex-1">

          {loading ? (

            <div className="flex h-full flex-col items-center justify-center gap-3">

              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

              <p className="text-xs text-slate-400">
                Loading appointments...
              </p>

            </div>

          ) : appointments.length > 0 ? (

            <div className="flex h-full flex-col pt-3">

              {/* ================= DESKTOP LIST ================= */}
              <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">

                {/* TABLE HEADER */}
                <div className="sticky top-0 z-10 hidden border-b border-slate-200 bg-[#f7f9fc] pb-2 lg:grid lg:grid-cols-[minmax(220px,1.5fr)_1fr_1fr_120px_100px] lg:items-center lg:gap-4">

                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Patient
                  </span>

                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Appointment
                  </span>

                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Contact
                  </span>

                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Status
                  </span>

                  <span />
                </div>


                {/* ================= APPOINTMENT ROWS ================= */}
                <div className="divide-y divide-slate-200">

                  {appointments.map((item, index) => {

                    const status = item?.status?.toLowerCase();

                    const statusConfig =
                      status === "accepted"
                        ? {
                          label: "Approved",
                          dot: "bg-emerald-500",
                          text: "text-emerald-600",
                          bg: "bg-emerald-50",
                        }
                        : status === "pending"
                          ? {
                            label: "Pending",
                            dot: "bg-amber-500",
                            text: "text-amber-600",
                            bg: "bg-amber-50",
                          }
                          : {
                            label: "Rejected",
                            dot: "bg-red-500",
                            text: "text-red-600",
                            bg: "bg-red-50",
                          };

                    return (
                      <div
                        key={index}
                        className="group grid grid-cols-1 gap-4 py-4 lg:grid-cols-[minmax(220px,1.5fr)_1fr_1fr_120px_100px] lg:items-center lg:gap-4"
                      >

                        {/* ================= PATIENT ================= */}
                        <div className="flex min-w-0 items-center gap-3">

                          <div className="relative shrink-0">

                            <img
                              src={item?.image}
                              alt={item?.patientName || "Patient"}
                              className="h-11 w-11 rounded-xl border border-slate-200 bg-white object-cover"
                            />

                            <span
                              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#f7f9fc] ${statusConfig.dot}`}
                            />

                          </div>


                          <div className="min-w-0">

                            <h2 className="truncate text-sm font-semibold text-slate-800">
                              {item?.patientName || "Unknown Patient"}
                            </h2>

                            <div className="mt-0.5 flex items-center gap-2">

                              <span className="text-[10px] text-slate-400">
                                ID: {item?.patientId || "—"}
                              </span>

                              {item?.reason && (
                                <>
                                  <span className="text-slate-200">
                                    •
                                  </span>

                                  <span className="truncate text-[10px] text-slate-400">
                                    {item.reason}
                                  </span>
                                </>
                              )}

                            </div>

                          </div>

                        </div>


                        {/* ================= DATE / TIME ================= */}
                        <div className="flex items-center gap-3 lg:block">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 lg:hidden">
                            <i className="bi bi-calendar3 text-xs" />
                          </div>

                          <div>

                            <p className="text-[11px] font-semibold text-slate-700">
                              {item?.appointmentDate || "—"}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {item?.appointmentTime || "—"}
                            </p>

                          </div>

                        </div>


                        {/* ================= CONTACT ================= */}
                        <div className="hidden min-w-0 lg:block">

                          <p className="truncate text-[11px] text-slate-600">
                            {item?.patientEmail || "No email"}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {item?.patientPhone || "No phone"}
                          </p>

                        </div>


                        {/* ================= STATUS ================= */}
                        <div>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`}
                            />

                            {statusConfig.label}
                          </span>

                        </div>


                        {/* ================= ACTION ================= */}
                        <div className="flex lg:justify-end">

                          <button
                            type="button"
                            onClick={() =>
                              navigate("/appoinment/details", {
                                state: { body: item },
                              })
                            }
                            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            Details
                            <i className="bi bi-arrow-up-right text-[9px]" />
                          </button>

                        </div>

                      </div>
                    );
                  })}

                </div>

              </div>


              {/* ================= PAGINATION ================= */}
              {(appointments.length > 8 || totalPages > 1) && (

                <div className="shrink-0 border-t border-slate-200 pt-3">

                  <div className="flex items-center justify-between">

                    <button
                      type="button"
                      onClick={() => setPage((prev) => prev - 1)}
                      disabled={page === 1}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold text-slate-500 transition hover:bg-white hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30 sm:text-xs"
                    >
                      <i className="bi bi-chevron-left" />
                      Previous
                    </button>


                    <div className="text-[11px] text-slate-400 sm:text-xs">

                      Page{" "}

                      <span className="font-bold text-slate-700">
                        {page}
                      </span>

                      {" "}of{" "}

                      <span className="font-bold text-slate-700">
                        {totalPages}
                      </span>

                    </div>


                    <button
                      type="button"
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={page === totalPages}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-30 sm:text-xs"
                    >
                      Next
                      <i className="bi bi-chevron-right" />
                    </button>

                  </div>

                </div>

              )}

            </div>

          ) : (

            /* ================= EMPTY ================= */
            <div className="flex h-full flex-col items-center justify-center text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200">
                <i className="bi bi-calendar2-x text-xl text-slate-300" />
              </div>

              <h2 className="mt-4 text-sm font-semibold text-slate-700">
                No {statusFilter !== "All" ? statusFilter.toLowerCase() : ""} appointments
              </h2>

              <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                Try another search or change the appointment status filter.
              </p>

            </div>

          )}

        </div>

      </div>

    </section>
  );
}

export default Appoiment;