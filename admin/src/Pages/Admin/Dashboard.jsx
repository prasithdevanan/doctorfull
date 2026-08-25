import React, { useContext, useState, useEffect, use } from 'react'
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { Images } from '../../Components/Images';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../socket/socket';
import { toast } from 'react-toastify';

function Dashboard() {
  const navigate = useNavigate();

  const { BackendUrl, user, userLoading } = useContext(AdminContext);
  const [load, setLoad] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [newDoctor, setNewDoctor] = useState([]);
  const [appointmentList, setAppointmentList] = useState([]);
  const [newAppointment, setNewAppointment] = useState([]);
  const doctor = localStorage.getItem("dToken") ? true : false;

  //feach the data from the DB doctorList
  useEffect(() => {
    const feachDoctors = async () => {
      try {
        setLoad(true);
        const res = await axios.get(`${BackendUrl}/api/doctor/list`);
        const resPatient = await axios.get(`${BackendUrl}/api/patient/list`);
        const resAppoint = await axios.get(`${BackendUrl}/api/admin/appointment`);
        if (!res.data.success || !resPatient.data.success || !resAppoint.data.success) {
          console.log(res.data.message);
        }
        //set the data to the doctorsList
        setDoctorsList(res.data.doctorsList);
        setNewDoctor(res.data.doctorsList.slice(-3));

        //set the data to the patientsList
        setPatientsList(resPatient.data.patientsList);

        //set the data for the appointmentList
        setAppointmentList(resAppoint.data.appointments);
        setNewAppointment(resAppoint.data.appointments.slice(-4));
      } catch (error) {
        console.log(error?.response?.data?.message);
      } finally {
        setLoad(false);
      }
    }
    feachDoctors();
  }, [BackendUrl]);


  const [data, setData] = useState([]);

  //clear the data
  useEffect(() => {
    setData([])
  }, [user]);

  //socket conection for the doctor and register
  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      console.log("No user found");
      return;
    }
    socket.emit("register", { userId: user._id, role: "Doctor" });


    // Listen for new_appointment events
    socket.on("new_appointment", (newData) => {

      setData((prev = []) => {

        const exists = prev.find(
          (item) => item._id === newData._id
        );

        if (exists) return prev;

        return [...prev, newData];
      });
    });

    // pending notifications
    socket.on("pending_notifications", (data) => {
      setData((prevData) => {
        const merged = [...prevData];
        data.forEach((item) => {
          const exists = merged.find((d) => d._id === item._id);
          if (!exists) {
            merged.push(item);
          }
        })
        return merged;
      });
    });

    // user_appointment_delete
    socket.on("user_appointment_delete", ({ appointmentId, doctorId }) => {
      setData((prev) => {
        prev.filter((item) => item.appointmentId !== appointmentId)
      });
    });

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("new_appointment");
      socket.off("pending_notifications");
      socket.off("user_appointment_delete");
      setData([]);
    }
  }, [user, userLoading]);


  // accept notification
  //accept Handle
  const acceptHandle = (item) => {
    if (!item) {
      return;
    }
    setData(data.filter((data) => data._id !== item._id));
    socket.emit("accept_appointment", ({ doctorId: item.doctorId, patientId: item.userId, notificationId: item._id, details: item }));
    toast.success("Appointment accepted");
  };


  const rejectHandle = (item) => {
    if (!item) return;

    socket.emit("reject_appointment", ({ doctorId: item.doctorId, patientId: item.userId, notificationId: item._id, details: item }));
    setData(data.filter((data) => data._id !== item._id));
    toast.error("Appointment rejected");
  }


  return (
    <>
      {load ? (
        <div className="flex h-[calc(100vh-68px)] w-full items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
            <p className="text-xs font-medium text-slate-500">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <section className="h-[calc(100vh-100px)] md:h-[calc(100vh-68px)] w-full overflow-auto lg:overflow-hidden bg-slate-50">

          <div className="mx-auto flex h-full max-w-[1800px] flex-col px-3 py-3 sm:px-5 sm:py-4 lg:px-6">

            {/* ================= HEADER ================= */}
            <div className="mb-3 flex shrink-0 items-center justify-between sm:mb-4">

              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
                  Dashboard
                </h1>

                <p className="mt-0.5 hidden text-xs text-slate-400 sm:block">
                  Healthcare management overview
                </p>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-600 sm:px-3 sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="hidden sm:inline">System Online</span>
                <span className="sm:hidden">Online</span>
              </div>

            </div>


            {/* ================= STATS ================= */}
            {!doctor && (
              <div className="mb-3 grid shrink-0 grid-cols-2 gap-2.5 sm:mb-4 sm:grid-cols-4 sm:gap-3 lg:gap-4">

                {[
                  {
                    label: "Doctors",
                    count: doctorsList.length,
                    img: Images.Doctor,
                    bg: "bg-blue-50",
                    color: "text-blue-600",
                  },
                  {
                    label: "Patients",
                    count: patientsList.length,
                    img: Images.Patient,
                    bg: "bg-emerald-50",
                    color: "text-emerald-600",
                  },
                  {
                    label: "Appointments",
                    count: appointmentList.length,
                    img: Images.Appointment,
                    bg: "bg-violet-50",
                    color: "text-violet-600",
                  },
                  {
                    label: "Revenue",
                    count: "$",
                    img: Images.Appointment,
                    bg: "bg-amber-50",
                    color: "text-amber-600",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group flex min-w-0 items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white px-3 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:gap-3 sm:px-4"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.bg} sm:h-10 sm:w-10`}>
                      <img src={item.img} alt={item.label} className="h-5 w-5 object-contain sm:h-6 sm:w-6" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-medium text-slate-400 sm:text-xs">
                        {item.label}
                      </p>

                      <p className={`text-lg font-bold ${item.color} sm:text-xl`}>
                        {typeof item.count === "number" ? item.count.toString().padStart(2, "0") : item.count}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            )}


            {/* ================= MAIN GRID ================= */}
            <div className="grid lg:min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)] lg:gap-4">


              {/* ================================================= */}
              {/* NEW APPOINTMENTS */}
              {/* ================================================= */}
              <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">

                <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                        New Appointments
                      </h2>

                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                        {data?.length || 0}
                      </span>
                    </div>

                    <p className="mt-0.5 hidden text-[11px] text-slate-400 sm:block">
                      Review incoming appointment requests
                    </p>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                    <i className="bi bi-calendar2-check" />
                  </div>

                </div>


                {data?.length > 0 ? (
                  <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">

                    <div className="space-y-2.5">

                      {data.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-all duration-200 hover:border-blue-100 hover:bg-blue-50/30 sm:p-3.5"
                        >

                          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">

                            {/* PATIENT */}
                            <div className="flex min-w-0 flex-1 items-center gap-3">

                              <div className="relative shrink-0">
                                <img
                                  src={item.data.image}
                                  alt="Patient"
                                  className="h-11 w-11 rounded-xl border border-white object-cover shadow-sm sm:h-12 sm:w-12"
                                />

                                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                              </div>

                              <div className="min-w-0 flex-1">

                                <div className="flex flex-wrap items-center gap-1.5">
                                  <h3 className="truncate text-sm font-semibold text-slate-800">
                                    {item.data.patientName}
                                  </h3>

                                  <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[9px] font-semibold text-blue-600">
                                    NEW
                                  </span>
                                </div>

                                <p className="truncate text-[11px] text-slate-400">
                                  {item.data.patientEmail}
                                </p>

                                <div className="mt-1.5 flex flex-wrap gap-3 text-[10px] text-slate-500 sm:text-[11px]">
                                  <span className="flex items-center gap-1">
                                    <i className="bi bi-calendar3 text-blue-500" />
                                    {item.data.appointmentDate}
                                  </span>

                                  <span className="flex items-center gap-1">
                                    <i className="bi bi-clock text-blue-500" />
                                    {item.data.appointmentTime}
                                  </span>
                                </div>

                              </div>
                            </div>


                            {/* REASON */}
                            <div className="min-w-0 xl:w-[220px]">

                              <div className="rounded-lg bg-white px-3 py-2">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
                                  Reason
                                </p>

                                <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                                  {item.data.reason}
                                </p>
                              </div>

                            </div>


                            {/* ACTIONS */}
                            <div className="flex shrink-0 gap-2">

                              <button
                                type="button"
                                onClick={() => acceptHandle(item)}
                                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-emerald-600 active:scale-95 xl:flex-none"
                              >
                                <i className="bi bi-check-lg" />
                                Accept
                              </button>

                              <button
                                type="button"
                                onClick={() => rejectHandle(item)}
                                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-white px-3 py-2 text-[11px] font-semibold text-red-500 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white active:scale-95 xl:flex-none"
                              >
                                <i className="bi bi-x-lg" />
                                Decline
                              </button>

                            </div>

                          </div>

                        </div>
                      ))}

                    </div>

                  </div>
                ) : (
                  <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-5 text-center">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                      <i className="bi bi-calendar2-x text-2xl text-slate-300" />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      No New Appointments
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      New appointment requests will appear here
                    </p>

                  </div>
                )}

              </div>


              {/* ================================================= */}
              {/* RIGHT SIDE */}
              {/* ================================================= */}
              <div className="grid min-h-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">


                {/* ================================================= */}
                {/* NEW DOCTORS */}
                {/* ================================================= */}
                <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">

                  <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">

                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        New Doctors
                      </h3>

                      <p className="text-[10px] text-slate-400">
                        Recently registered doctors
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                      {newDoctor?.length || 0} NEW
                    </span>

                  </div>


                  <div className="min-h-0 flex-1 overflow-y-auto p-2.5">

                    {newDoctor?.length > 0 ? (
                      <div className="space-y-1.5">

                        {newDoctor.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-slate-50"
                          >

                            <div className="relative shrink-0">
                              <img
                                src={item.image}
                                alt="Doctor"
                                className="h-10 w-10 rounded-full border border-slate-100 object-cover"
                              />

                              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                            </div>

                            <div className="min-w-0 flex-1">

                              <p className="truncate text-xs font-semibold text-slate-700">
                                {item.name}
                              </p>

                              <p className="truncate text-[10px] text-slate-400">
                                {item.email}
                              </p>

                              <p className="truncate text-[10px] font-medium text-blue-500">
                                {item.speciality}
                              </p>

                            </div>

                            <i className="bi bi-chevron-right text-[10px] text-slate-300" />

                          </div>
                        ))}

                      </div>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-center">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                          <i className="bi bi-person-plus text-lg text-slate-300" />
                        </div>

                        <p className="mt-2 text-xs font-medium text-slate-500">
                          No new doctors
                        </p>

                      </div>
                    )}

                  </div>

                </div>


                {/* ================================================= */}
                {/* RECENT APPOINTMENTS */}
                {/* ================================================= */}
                <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">

                  <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">

                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        Recent Activity
                      </h3>

                      <p className="text-[10px] text-slate-400">
                        Latest appointments
                      </p>
                    </div>

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
                      <i className="bi bi-activity text-xs" />
                    </div>

                  </div>


                  <div className="min-h-0 flex-1 overflow-y-auto p-2.5">

                    {newAppointment?.length > 0 ? (
                      <div className="space-y-1.5">

                        {newAppointment.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2.5 rounded-xl p-2.5 transition-colors hover:bg-slate-50"
                          >

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
                              <i className="bi bi-calendar-check text-xs" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-slate-700">
                                {item.patientName}
                              </p>

                              <p className="text-[10px] text-slate-400">
                                Appointment booked
                              </p>
                            </div>

                            <i className="bi bi-check-circle-fill text-[10px] text-emerald-500" />

                          </div>
                        ))}

                      </div>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-center">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                          <i className="bi bi-calendar-x text-lg text-slate-300" />
                        </div>

                        <p className="mt-2 text-xs font-medium text-slate-500">
                          No recent activity
                        </p>

                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>
      )}
    </>
  )
}


export default Dashboard;