import React, { useEffect, useState, useContext } from "react";
import { AdminContext } from "../../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Appoiment() {
  const navigate = useNavigate();
  const { BackendUrl, dToken } = useContext(AdminContext);
  const [dEmail, setDEmail] = useState(localStorage.getItem("dEmail") || "");
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(9); // items per page
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
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

  return (
    <section className="h-[calc(100vh-56px)] w-full px-4 sm:px-6 py-6 bg-gray-50 overflow-y-auto">

      {/* ---------------- Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Appointments
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your appointments
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search doctor..."
            className="w-full px-4 py-2 pl-10 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>

      </div>

      {/* ---------------- Loading */}
      {loading ? (
        <div className="text-center py-10 text-gray-400 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Loading appointments...
        </div>

      ) : appointments.length > 0 ? (
        <>
          {/* ---------------- Grid */}
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-20">

            {appointments.map((item, index) => (
              <div
                key={index}
                className="relative group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >

                {/* Status */}
                <span
                  className={`absolute top-4 right-4 px-2.5 py-1 text-[11px] font-medium rounded-full border
              ${item?.status === "Accepted"
                      ? "bg-green-50 text-green-600 border-green-100"
                      : item?.status === "Pending"
                        ? "bg-yellow-50 text-yellow-600 border-yellow-100"
                        : "bg-red-50 text-red-600 border-red-100"
                    }`}
                >
                  {item?.status}
                </span>

                {/* Patient */}
                <div className="flex items-center gap-3 mb-3">

                  <img
                    src={item?.image}
                    alt="doctor"
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />

                  <div>
                    <h2 className="text-sm font-semibold text-gray-800">
                      {item?.patientName}
                    </h2>

                    <p className="text-xs text-gray-400">
                      {item?.reason?.length > 14
                        ? item.reason.slice(0, 14) + "..."
                        : item.reason}
                    </p>
                  </div>

                </div>

                {/* Email */}
                <p className="text-xs text-gray-400 mb-3 break-all">
                  {item?.patientEmail}
                </p>

                {/* Info box */}
                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1 border border-gray-100">
                  <p>
                    <span className="font-medium">Patient ID:</span> {item?.patientId}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {item?.patientPhone}
                  </p>
                </div>

                {/* Button */}
                <button
                  onClick={() =>
                    navigate('/appoinment/details', { state: { body: item } })
                  }
                  className="mt-4 cursor-pointer w-full py-2.5 rounded-xl bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition active:scale-95"
                >
                  View Details
                </button>

              </div>
            ))}

          </div>

          {/* ---------------- Pagination */}
          {(appointments.length > 8 || totalPages > 1) && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] sm:w-[calc(100vw-280px)]">

              <div className="flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3">

                <button
                  onClick={() => setPage((prev) => prev - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition"
                >
                  Prev
                </button>

                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold text-gray-900">{page}</span> of {totalPages}
                </div>

                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  Next
                </button>

              </div>

            </div>
          )}

        </>

      ) : (
        <div className="text-center text-gray-400 py-10">
          No appointments found
        </div>
      )}

    </section>
  )
}

export default Appoiment;