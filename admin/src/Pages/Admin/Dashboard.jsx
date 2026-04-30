import React, { useRef, useContext, useState, useEffect } from 'react'
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { Images } from '../../Components/Images';
import Draggable from "react-draggable";

function Dashboard() {

  useEffect(() => {
    const dToken = localStorage.getItem('dToken');
    const aToken = localStorage.getItem('aToken');
    if (!dToken || !aToken) {
      window.location.href = "/login";
    }
  })

  const { BackendUrl } = useContext(AdminContext);

  const [doctorsList, setDoctorsList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [newDoctor, setNewDoctor] = useState([]);
  const [appointmentList, setAppointmentList] = useState([]);
  const [newAppointment, setNewAppointment] = useState([]);

  //feach the data from the DB doctorList

  useEffect(() => {
    const feachDoctors = async () => {
      console.log("feach");
      try {
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
        setNewAppointment(resAppoint.data.appointments.slice(-3));
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    }
    feachDoctors();
  }, [BackendUrl]);

  const nodeRef = useRef(null);


  return (
    <>
      <section className='w-full'>
        <div className=" mt-6 justify-center gap-3 md:gap-6 grid grid-cols-2 px-2 md:flex">
          {[
            { label: "Total Doctor", count: doctorsList.length.toString().padStart(2, "0"), img: Images.Doctor },
            { label: "Total Patients", count: patientsList.length.toString().padStart(2, "0"), img: Images.Patient },
            { label: "Total Appointment", count: appointmentList.length.toString().padStart(2, "0"), img: Images.Appointment },
            { label: "Revenue", count: "$", img: Images },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-5 border border-gray-200 rounded-lg bg-white/60 shadow-[0_0_10px_0_rgba(0,0,0,0.1)]"
            >
              <img src={item.img} alt={item.label} className="w-10 h-10 object-contain" />

              <div>
                <h1 className="text-sm text-gray-500">{item.label}</h1>
                <p className="text-lg font-semibold text-gray-600">{item.count}</p>
              </div>
            </div>
          ))}
        </div>
        {newDoctor?.length > 0 &&
          <>
            <div className='w-fit shrink-0 flex flex-col gap-1 bg-gray-100 px-2 py-2 rounded-md mx-auto mt-3'>
              <div className='flex justify-between mb-1'>
                <h4 className='font-medium text-sm text-gray-400'>New Doctors</h4>
                <p className='bg-green-600/30 rounded-full px-2 text-green-600 w-fit text-sm'>new</p>
              </div>
              {
                newDoctor?.map((item, index) => {
                  return (
                    <Draggable key={index} nodeRef={nodeRef}>
                      <div ref={nodeRef} className='flex items-center gap-2 border border-gray-200 px-2 py-1 rounded-md bg-white/60 cursor-grab'>
                        <div>
                          <img src={item.image} alt="img" className='w-20 bg-(--color-primary)/10 p-2 rounded-full' />
                        </div>
                        <div>
                          <p className='text-gray-700 font-semibold text-base'>{item.name}</p>
                          <p className='text-gray-600 text-sm'>{item.email}</p>
                          <p className='text-gray-400 text-xs'>{item.speciality}</p>
                        </div>

                      </div>
                    </Draggable>
                  )
                })
              }
            </div>
            <div className='bg-gray-100 px-2 py-4 w-fit mx-auto'>
              <h4>New Appointments</h4>
              {
                newAppointment.map((item) => {
                  return (
                    <div>
                      <h4>{item.patientName}</h4>
                    </div>
                  )
                })
              }
            </div>
          </>
        }

      </section>
    </>
  )
}

export default Dashboard;