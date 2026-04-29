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
    <section className="h-[calc(100vh-56px)] w-full px-4 py-6 bg-gray-50 overflow-y-auto pb-10">

      {/* -------------- Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Appointments
        </h1>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search doctor..."
            className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <span className="absolute left-3 top-2.5 text-gray-400"><i className="bi bi-search"></i></span>
        </div>

      </div>

      {/* -------------- Loading */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading appointments...
        </div>
      ) : appointments.length > 0 ? (
        <>
          {/* -------------- Grid */}
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

            {appointments.map((item, index) => (
              <div
                key={index}
                className="relative group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl transition duration-300 cursor-pointer"
              >

                {/* Status Badge */}
                <span
                  className={`absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full cursor-pointer
              ${item?.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : item?.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {item?.status}
                </span>

                {/* Doctor Info */}
                <div className="flex items-center gap-3 mb-4">

                  <img
                    src={item?.image}
                    alt="doctor"
                    className="w-14 h-14 rounded-full object-cover border border-gray-200"
                  />

                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item?.doctorName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {item?.doctorSpeciality}
                    </p>
                  </div>

                </div>

                {/* Email */}
                <p className="text-xs text-gray-400 break-all mb-3">
                  {item?.doctorEmail}
                </p>

                {/* Patient Info */}
                <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium">Patient:</span> {item?.patientName}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {item?.patientPhone}
                  </p>
                </div>

                {/* Action Button */}
                <button className="mt-4 w-full py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition cursor-pointer" onClick={() => navigate('/appoinment/details', { state: { body: item }})}>
                  View Details
                </button>

              </div>
            ))}

          </div>

          {/* -------------- Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10">

            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
              className="flex justify-center items-center gap-2 w-full sm:w-auto px-6 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50 cursor-pointer"
            >
              <i className="bi bi-arrow-left-short"></i> Prev
            </button>

            <div className="text-sm font-medium text-gray-600">
              Page <span className="text-gray-900 font-semibold">{page}</span> of {totalPages}
            </div>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === totalPages}
              className=" flex justify-center items-center gap-2 w-full sm:w-auto px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
            >
              Next<i className="bi bi-arrow-right-short"></i>
            </button>

          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 py-10">
          No appointments found
        </div>
      )}

    </section>
  )
}

export default Appoiment;