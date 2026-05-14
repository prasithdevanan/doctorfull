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
    socket.connect();
    socket.emit("register", { userId: user._id, role: "Doctor" });
    console.log(user._id);

    // Listen for new_appointment events
    socket.on("new_appointment", (data) => {
      console.log(data);

      setData((prev) => {

        // Prevent duplicates
        const exists = prev.find(
          (item) => item._id === data._id
        );

        if (exists) return prev;

        return [...prev, data];
      });
    });

    // pending notifications
    socket.on("pending_notifications", (data) => {
      console.log(data);
      setData((prevData) => {
        const merged = [...prevData];
        data.forEach((item) => {
          const exists = merged.find((d) => d._id === item._id);
          console.log(exists);

          if (!exists) {
            merged.push(item);
          }
        })
        return merged;
      });
    });

    return () => {
      socket.off("new_appointment");
      socket.off("pending_notifications");
      socket.disconnect();
      setData([]);
    }
  }, [user, userLoading]);


  // accept notification
  //accept Handle
  const acceptHandle = (item) => {
    if (!item) {
      return;
    }
    console.log(item);
    setData(data.filter((data) => data._id !== item._id));
    socket.emit("accept_appointment", ({ doctorId: item.doctorId, patientId: item.userId, notificationId: item._id, details: item }));
    toast.success("Appointment accepted");
  };


  const rejectHandle = (item) => {
    if (!item) return;
    console.log(item);

    socket.emit("reject_appointment", ({ doctorId: item.doctorId, patientId: item.userId, notificationId: item._id, details: item }));
    setData(data.filter((data) => data._id !== item._id));
    toast.error("Appointment rejected");
  }


  return (
    <>
      {
        load ? (
          <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center flex-col gap-2">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin">
            </div>
            <p>Loading..</p>
          </div>
        ) : (

          < section className="w-full h-[calc(100vh-64px)] overflow-y-auto px-4 sm:px-6 py-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

            {/* ===== STATS CARDS ===== */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {[
                { label: "Doctors", count: doctorsList.length.toString().padStart(2, "0"), img: Images.Doctor },
                { label: "Patients", count: patientsList.length.toString().padStart(2, "0"), img: Images.Patient },
                { label: "Appointments", count: appointmentList.length.toString().padStart(2, "0"), img: Images.Appointment },
                { label: "Revenue", count: "$", img: Images.Appointment },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  {/* Icon */}
                  <div className="p-3 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition">
                    <img src={item.img} alt={item.label} className="w-6 h-6 object-contain" />
                  </div>

                  {/* Text */}
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <h2 className="text-xl font-semibold text-gray-800">{item.count}</h2>
                  </div>

                  {/* subtle hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-50 to-transparent transition"></div>
                </div>
              ))}

            </div>


            {/* ===================New Appointement=================== */}
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                  New Appointments
                </h2>

                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600 font-medium">
                  {data.length} Requests
                </span>
              </div>

              {data.length > 0 ? (
                <div className="max-h-[400px] overflow-y-auto px-8 space-y-4 custom-scrollbar ">
                  {data.map((item, index) => (
                    <div
                      key={index}
                      className="group relative bg-white/90 backdrop-blur-lg border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {/* TOP */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                        {/* LEFT */}
                        <div className="flex gap-4 items-start">

                          {/* IMAGE */}
                          <div className="relative">
                            <img
                              src={item.data.image}
                              alt="Patient"
                              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                            />

                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                          </div>

                          {/* DETAILS */}
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {item.data.patientName}
                            </h3>

                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="px-2 py-1 text-xs rounded-lg bg-gray-100 text-gray-600">
                                ID : {item.data.patientId}
                              </span>

                              <span className="px-2 py-1 text-xs rounded-lg bg-blue-50 text-blue-600">
                                New Patient
                              </span>
                            </div>

                            <p className="text-sm text-gray-500">
                              {item.data.patientEmail}
                            </p>

                            <div className="flex flex-wrap gap-3 mt-2 text-sm">

                              <div className="flex items-center gap-1 text-gray-600">
                                <i className="bi bi-calendar2-week"></i>
                                {item.data.appointmentDate}
                              </div>

                              <div className="flex items-center gap-1 text-gray-600">
                                <i className="bi bi-clock"></i>
                                {item.data.appointmentTime}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col items-start lg:items-end gap-3">

                          <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 max-w-[320px]">
                            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                              Reason
                            </p>

                            <p className="text-sm text-gray-700 leading-relaxed">
                              {item.data.reason}
                            </p>
                          </div>

                          {/* BUTTONS */}
                          <div className="flex gap-3 w-full lg:w-auto">

                            <button
                              onClick={() => acceptHandle(item)}
                              className="cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 text-white font-medium shadow-md hover:bg-green-600 hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                              <i className="bi bi-check-lg"></i>
                              Accept
                            </button>

                            <button
                              onClick={() => rejectHandle(item)}
                              className="cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                              <i className="bi bi-x-lg"></i>
                              Decline
                            </button>

                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                  <i className="bi bi-calendar2-x text-5xl text-gray-300"></i>

                  <p className="mt-4 text-lg font-semibold text-gray-600">
                    No New Appointments
                  </p>

                  <span className="text-sm text-gray-400">
                    New appointment requests will appear here
                  </span>
                </div>
              )}
            </div>
            {/* ===== NEW DOCTORS ===== */}
            {newDoctor?.length > 0 && (
              <div className="mt-8 grid md:grid-cols-2 gap-6">

                {/* Doctors Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">

                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-semibold text-gray-700">New Doctors</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                      New
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">

                    {newDoctor.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                      >
                        <img
                          src={item.image}
                          alt="doctor"
                          className="w-14 h-14 rounded-full object-cover border border-black/20"
                        />

                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.email}</p>
                          <p className="text-xs text-blue-500">{item.speciality}</p>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>


                {/* Appointments Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">

                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    New Appointments
                  </h4>

                  <div className="flex flex-col gap-3">

                    {newAppointment.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {item.patientName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Appointment booked
                        </p>
                      </div>
                    ))}

                  </div>
                </div>

              </div>
            )}

          </section >
        )}
    </>

  )
}


export default Dashboard;