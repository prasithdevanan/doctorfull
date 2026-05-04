import React, { useContext, useEffect, useState } from 'react';
import { Images } from '../../Components/Images';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
        console.log(res.data.doctorsList);
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
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <>
      <section className="w-full px-4 sm:px-6 py-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
        {/* ===== HEADER ===== */}
        < div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          {/* Left Section */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
              Doctors
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Total:
              <span className="ml-1 font-semibold text-gray-800">
                {doctorsList.length}
              </span>
            </p>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 w-full sm:w-auto">

            {/* Search */}
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
              <span className="absolute left-3 top-2.5 text-gray-400">
                <i className="bi bi-search"></i>
              </span>
            </div>

            {/* Add Doctor Button */}
            {aToken && (
              <button
                onClick={() => navigate('/add-doctor')}
                className="whitespace-nowrap px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 hover:shadow-md transition cursor-pointer"
              >
                + Add Doctor
              </button>
            )}

          </div>
        </div >

        {load ? (
          <div className="flex flex-col items-center justify-center py-16 w-full h-full my-auto">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              Fetching doctors
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-200">.</span>
              <span className="animate-bounce delay-400">.</span>
            </p>
          </div>
        ) : (
          <>
            {/* ===== LIST ===== */}

            < div className="h-[75vh] overflow-y-auto space-y-3 pr-1" >

              {
                doctorsList.map((item, index) => (
                  <div
                    key={index}
                    className="group flex flex-col sm:flex-row gap-4 sm:items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                  >

                    {/* Image */}
                    <img
                      src={item.image}
                      alt="doctor"
                      className="w-full sm:w-24 h-24 rounded-lg object-cover border border-black/20"
                    />

                    {/* Info */}
                    <div className="flex-1 text-sm space-y-1">
                      <p className="text-base font-semibold text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-gray-500">{item.email}</p>

                      <div className="flex flex-wrap gap-2 text-xs mt-1">
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                          {item.degree}
                        </span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
                          {item.speciality}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2 sm:items-end">

                      <button
                        onClick={() => { setSelectedDoctorId(item._id); setShowConfirm(true); }}
                        className="cursor-pointer px-4 py-2 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                ))
              }

            </div >

            {showConfirm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="bg-white rounded-xl p-6 w-[300px] shadow-lg text-center space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Confirm Delete
                  </h2>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this doctor?
                  </p>

                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        onDeleteHandle(selectedDoctorId);
                        setShowConfirm(false);
                      }}
                      className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </div>
            )
            }


          </>

        )
        }
      </section >
    </>
  )
}

export default DoctorList