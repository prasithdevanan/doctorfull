import React, { useRef, useContext, useState, useEffect } from 'react'
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { Images } from '../../Components/Images';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const { BackendUrl } = useContext(AdminContext);
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

  const nodeRef = useRef(null);


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

          < section className="w-full h-[calc(100vh-64px)] overflow-y-auto px-4 sm:px-6 py-6 bg-gray-50">

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
                          className="w-14 h-14 rounded-full object-cover border"
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