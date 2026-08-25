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
    <section className="h-[calc(100vh-60px)] w-full overflow-y-auto bg-[#f8fafc]">

      <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          {/* TITLE */}
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Medical Directory
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Doctors
            </h1>

            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              View and manage doctors registered in your system.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">

            {/* SEARCH */}
            <div className="relative w-full sm:w-72">

              <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

              <input
                type="text"
                placeholder="Search by name, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* ADD DOCTOR */}
            {aToken && (
              <button
                type="button"
                onClick={() => navigate("/add-doctor")}
                className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
              >
                <i className="bi bi-plus-lg" />
                Add Doctor
              </button>
            )}

          </div>

        </div>


        {/* ================= SUMMARY ================= */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

          {/* TOTAL */}
          <div className="border-l-2 border-blue-500 bg-white px-4 py-3 shadow-sm">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Total Doctors
            </p>

            <p className="mt-1 text-xl font-bold text-slate-800">
              {doctorsList.length}
            </p>
          </div>


          {/* ONLINE */}
          <div className="border-l-2 border-emerald-500 bg-white px-4 py-3 shadow-sm">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Online
            </p>

            <p className="mt-1 text-xl font-bold text-slate-800">
              {doctorsList.filter((item) => item.isOnline).length}
            </p>
          </div>


          {/* OFFLINE */}
          <div className="border-l-2 border-slate-300 bg-white px-4 py-3 shadow-sm">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Offline
            </p>

            <p className="mt-1 text-xl font-bold text-slate-800">
              {doctorsList.filter((item) => !item.isOnline).length}
            </p>
          </div>


          {/* DIRECTORY */}
          <div className="border-l-2 border-indigo-500 bg-white px-4 py-3 shadow-sm">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Directory
            </p>

            <p className="mt-1 text-xl font-bold text-slate-800">
              Active
            </p>
          </div>

        </div>


        {/* ================= CONTENT ================= */}
        {load ? (

          <div className="flex min-h-[55vh] items-center justify-center">

            <div className="flex flex-col items-center gap-3">

              <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

              <p className="text-xs text-slate-400">
                Loading doctors...
              </p>

            </div>

          </div>

        ) : doctorsList.length > 0 ? (

          <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">

            {/* ================= TABLE HEADER ================= */}
            <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 lg:grid lg:grid-cols-[2fr_1.4fr_1.2fr_1fr_auto] lg:items-center lg:gap-5">

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Doctor
              </p>

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Specialization
              </p>

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Contact
              </p>

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Status
              </p>

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Actions
              </p>

            </div>


            {/* ================= DOCTOR LIST ================= */}
            <div className="divide-y divide-slate-100">

              {doctorsList.map((item, index) => (

                <div key={index} className="px-4 py-4 transition hover:bg-slate-50 sm:px-5">

                  {/* ================= DESKTOP ================= */}
                  <div className="hidden lg:grid lg:grid-cols-[2fr_1.4fr_1.2fr_1fr_auto] lg:items-center lg:gap-5">

                    {/* DOCTOR */}
                    <div className="flex min-w-0 items-center gap-3">

                      <div className="relative shrink-0">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-11 w-11 rounded-full border border-slate-200 bg-slate-100 object-cover"
                        />

                        <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${item.isOnline ? "bg-emerald-500" : "bg-slate-300"}`} />

                      </div>


                      <div className="min-w-0">

                        <h2 className="truncate text-sm font-semibold text-slate-800">
                          {item.name}
                        </h2>

                        <p className="mt-0.5 truncate text-[11px] text-slate-400">
                          {item.email}
                        </p>

                      </div>

                    </div>


                    {/* SPECIALIZATION */}
                    <div>

                      <p className="text-xs font-medium text-slate-700">
                        {item.speciality || "General"}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {item.degree || "Medical Doctor"}
                      </p>

                    </div>


                    {/* CONTACT */}
                    <div className="min-w-0">

                      <p className="truncate text-xs text-slate-600">
                        {item.mobile || "No phone"}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-slate-400">
                        Contact number
                      </p>

                    </div>


                    {/* STATUS */}
                    <div>

                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold ${item.isOnline ? "text-emerald-600" : "text-slate-400"}`}>

                        <span className={`h-1.5 w-1.5 rounded-full ${item.isOnline ? "bg-emerald-500" : "bg-slate-300"}`} />

                        {item.isOnline ? "Online" : "Offline"}

                      </span>

                    </div>


                    {/* ACTIONS */}
                    <div className="flex items-center gap-1">

                      <button
                        type="button"
                        onClick={() =>
                          navigate("/doctor/details", {
                            state: { body: item },
                          })
                        }
                        className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-3 text-[10px] font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        View
                        <i className="bi bi-arrow-up-right text-[9px]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDoctorId(item._id);
                          setShowConfirm(true);
                        }}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        title="Delete doctor"
                      >
                        <i className="bi bi-trash text-xs" />
                      </button>

                    </div>

                  </div>


                  {/* ================= MOBILE / TABLET ================= */}
                  <div className="lg:hidden">

                    <div className="flex items-start gap-3">

                      {/* IMAGE */}
                      <div className="relative shrink-0">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                        />

                        <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${item.isOnline ? "bg-emerald-500" : "bg-slate-300"}`} />

                      </div>


                      {/* INFO */}
                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-2">

                          <div className="min-w-0">

                            <h2 className="truncate text-sm font-semibold text-slate-800">
                              {item.name}
                            </h2>

                            <p className="mt-0.5 truncate text-[11px] text-slate-400">
                              {item.email}
                            </p>

                          </div>


                          <span className={`shrink-0 text-[10px] font-semibold ${item.isOnline ? "text-emerald-600" : "text-slate-400"}`}>
                            {item.isOnline ? "Online" : "Offline"}
                          </span>

                        </div>


                        {/* DETAILS */}
                        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">

                          <div>

                            <p className="text-[9px] uppercase tracking-wide text-slate-400">
                              Specialty
                            </p>

                            <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
                              {item.speciality || "General"}
                            </p>

                          </div>


                          <div>

                            <p className="text-[9px] uppercase tracking-wide text-slate-400">
                              Qualification
                            </p>

                            <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
                              {item.degree || "Medical Doctor"}
                            </p>

                          </div>


                          <div>

                            <p className="text-[9px] uppercase tracking-wide text-slate-400">
                              Phone
                            </p>

                            <p className="mt-0.5 truncate text-xs text-slate-600">
                              {item.mobile || "No phone"}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>


                    {/* MOBILE ACTIONS */}
                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">

                      <button
                        type="button"
                        onClick={() =>
                          navigate("/doctor/details", {
                            state: { body: item },
                          })
                        }
                        className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-900 text-[10px] font-semibold text-white transition hover:bg-blue-600"
                      >
                        View Profile
                        <i className="bi bi-arrow-up-right" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDoctorId(item._id);
                          setShowConfirm(true);
                        }}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                      >
                        <i className="bi bi-trash text-xs" />
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        ) : (

          /* ================= EMPTY ================= */
          <div className="flex min-h-[55vh] flex-col items-center justify-center border border-dashed border-slate-200 bg-white">

            <div className="flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-300">
              <i className="bi bi-person-x text-lg" />
            </div>

            <h2 className="mt-4 text-sm font-semibold text-slate-700">
              No doctors found
            </h2>

            <p className="mt-1 max-w-xs text-center text-xs text-slate-400">
              Try searching using another name, email or specialty.
            </p>

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="mt-4 cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}

          </div>

        )}


        {/* ================= DELETE MODAL ================= */}
        {showConfirm && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-sm">

            <div className="w-full max-w-sm border border-slate-200 bg-white p-5 shadow-2xl">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-red-50 text-red-500">
                  <i className="bi bi-trash text-sm" />
                </div>

                <div>

                  <h2 className="text-sm font-bold text-slate-800">
                    Delete doctor?
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    This doctor will be permanently removed from the directory.
                  </p>

                </div>

              </div>


              <div className="mt-6 flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="h-9 cursor-pointer rounded-lg bg-slate-100 px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onDeleteHandle(selectedDoctorId);
                    setShowConfirm(false);
                  }}
                  className="h-9 cursor-pointer rounded-lg bg-red-500 px-4 text-xs font-semibold text-white transition hover:bg-red-600"
                >
                  Delete Doctor
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </section>
  );
}

export default DoctorList