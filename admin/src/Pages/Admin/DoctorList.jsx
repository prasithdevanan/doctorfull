import React, { useContext, useEffect, useState } from 'react';
import { Images } from '../../Components/Images';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../socket/socket';

function DoctorList() {
  const navigate = useNavigate();
  const { BackendUrl, aToken } = useContext(AdminContext);
  const [doctorsList, setDoctorsList] = useState([]);
  const [load, setLoad] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [search, setSearch] = useState('');



  useEffect(() => {
    setLoad(true);
    const feachDoctors = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/api/doctor/list`, { params: { search: search } });
        if (!res.data.success) {
          console.log(res.data.message);
        }

        //set the data to the doctorsList
        return setDoctorsList(res.data.doctorsList);

      } catch (error) {
        console.log(error?.response?.data?.message);
      } finally {
        setLoad(false);
      }
    }
    feachDoctors();
  }, [BackendUrl, search]);


  const onDeleteHandle = async (id) => {
    try {
      const res = await axios.delete(`${BackendUrl}/api/admin/delete-doctor/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setDoctorsList(doctorsList.filter((item) => item._id !== id));
      }

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }


  useEffect(() => {

    if (!doctorsList.length) return;

    socket.emit(
      "getAllDoctorsOnlineStatus",
      {
        doctorIds: doctorsList.map((d) => d._id)
      }
    );

    const handleOnlineStatus = (data = []) => {

      const statusMap = {};

      data.forEach((item) => {
        statusMap[item.doctorId] = item.isOnline;
      });

      setDoctorsList((prev = []) =>
        prev.map((doctor) => ({
          ...doctor,
          isOnline: statusMap[doctor._id] ?? false
        }))
      );

    };

    socket.on("allDoctorsOnlineStatus", handleOnlineStatus);
    return () => {
      socket.off("allDoctorsOnlineStatus", handleOnlineStatus);
    };

  }, [doctorsList.length]);

  return (
    <>
      <section className="w-full h-[calc(100vh-60px)] bg-[#f6f8fc] px-4 sm:px-6 py-6 overflow-y-auto">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          {/* Left */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">
              Doctors
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage doctors & profiles
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">

            {/* Search */}
            <div className="relative w-full sm:w-80">

              <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

              <input
                type="text"
                placeholder="Search doctor..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full h-12 pl-11 pr-4 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
              />

            </div>

            {/* Add */}
            {aToken && (
              <button
                onClick={() => navigate("/add-doctor")}
                className="h-12 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium shadow-md hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                <i className="bi bi-plus-lg mr-2"></i>
                Add Doctor
              </button>
            )}

          </div>
        </div>

        {/* ================= LOADING ================= */}
        {load ? (

          <div className="h-[60vh] flex flex-col items-center justify-center">

            <div className="w-12 h-12 rounded-full border-[3px] border-blue-500 border-t-transparent animate-spin"></div>

            <p className="text-sm text-gray-400 mt-4">
              Loading doctors...
            </p>

          </div>

        ) : (

          <>
            {/* ================= GRID ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

              {doctorsList.map((item, index) => (

                <div
                  key={index}
                  className="group relative overflow-hidden bg-white rounded-3xl border border-gray-100 p-5 shadow-sm transition duration-300"
                >

                  {/* Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-blue-50/40 to-indigo-50/40 pointer-events-none"></div>

                  <div className="relative flex flex-col sm:flex-row gap-5">

                    {/* IMAGE */}
                    <div className="relative">

                      <img
                        src={item.image}
                        alt="doctor"
                        className="w-full sm:w-28 h-28 rounded-2xl object-cover border border-gray-100"
                      />

                      {/* Online Badge */}
                      <div className='flex justify-center items-center mt-4 gap-2.5 relative'>
                        <span className={`${item.isOnline ? "bg-green-500" : "bg-gray-300"} w-4 h-4 rounded-full border-2 border-white`}></span>
                        <span className={`${item.isOnline ? "bg-green-500" : "bg-gray-300"} absolute left-5 ${item.isOnline && "animate-ping"} w-4 h-4 rounded-full border-2 border-white`}></span>
                        <span>{item.isOnline ? "Online" : "Offline"}</span>
                      </div>

                    </div>

                    {/* INFO */}
                    <div className="flex-1">

                      {/* Top */}
                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <h2 className="text-xl font-semibold text-gray-800">
                            {item.name}
                          </h2>

                          <p className="text-sm text-gray-400 mt-1 break-all">
                            {item.email}
                          </p>

                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            setSelectedDoctorId(item._id);
                            setShowConfirm(true);
                          }}
                          className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition cursor-pointer"
                        >
                          <i className="bi bi-trash"></i>
                        </button>

                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-4">

                        <span className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 text-xs font-medium">
                          {item.degree}
                        </span>

                        <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 text-xs font-medium">
                          {item.speciality}
                        </span>

                      </div>

                      {/* Bottom */}
                      <div className="mt-5 flex items-center justify-between">

                        <div className="flex items-center gap-2 text-sm text-gray-500">

                          <i className="bi bi-telephone text-gray-400"></i>

                          {item.mobile || "No Phone"}

                        </div>

                        <button
                          className="cursor-pointer px-4 py-2 rounded-xl bg-gray-900 text-white text-sm hover:bg-black transition"
                        >
                          View Profile
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* ================= EMPTY ================= */}
            {doctorsList.length === 0 && (
              <div className="h-[50vh] flex flex-col items-center justify-center">

                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <i className="bi bi-person-x text-4xl text-blue-400"></i>
                </div>

                <h2 className="text-lg font-semibold text-gray-700">
                  No Doctors Found
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Try searching with another keyword
                </p>

              </div>
            )}

            {/* ================= MODAL ================= */}
            {showConfirm && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">

                <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl">

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
                    <i className="bi bi-trash text-2xl text-red-500"></i>
                  </div>

                  {/* Content */}
                  <div className="text-center">

                    <h2 className="text-xl font-semibold text-gray-800">
                      Delete Doctor
                    </h2>

                    <p className="text-sm text-gray-400 mt-2">
                      This action cannot be undone.
                    </p>

                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-6">

                    <button
                      onClick={() => setShowConfirm(false)}
                      className="cursor-pointer h-11 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        onDeleteHandle(selectedDoctorId);
                        setShowConfirm(false);
                      }}
                      className="cursor-pointer h-11 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            )}

          </>
        )}

      </section>
    </>
  )
}

export default DoctorList