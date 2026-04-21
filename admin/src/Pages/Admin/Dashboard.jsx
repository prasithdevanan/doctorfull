import React, { useRef, useContext, useState, useEffect } from 'react'
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { Images } from '../../Components/Images';
import Draggable from "react-draggable";

function Dashboard() {
  const { BackendUrl } = useContext(AdminContext);

  const [doctorsList, setDoctorsList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [newDoctor, setNewDoctor] = useState([]);

  //feach the data from the DB doctorList

  useEffect(() => {
    const feachDoctors = async () => {
      console.log("feach");
      try {
        const res = await axios.get(`${BackendUrl}/api/doctor/list`);
        const resPatient = await axios.get(`${BackendUrl}/api/patient/list`);
        if (!res.data.success || !resPatient.data.success) {
          console.log(res.data.message);
        }
        //set the data to the doctorsList
        setDoctorsList(res.data.doctorsList);
        setNewDoctor(res.data.doctorsList.slice(-3));

        //set the data to the patientsList
        setPatientsList(resPatient.data.patientsList);
        console.log(resPatient.data.patientsList);
        console.log(res.data.doctorsList);
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
        <div className='flex mt-3 justify-center gap-3'>
          <div className='flex border border-gray-200 px-3 py-2 justify-center items-center rounded-md bg-linear-(--color-gradient)'>
            <div className='mr-3'>
              <img src={Images.Doctor} alt="Doctoer" className='w-10' />
            </div>
            <div>
              <h1 className='text-gray-600'>Total Doctor</h1>
              <p className='font-bold text-blue-700'>{doctorsList.length}</p>
            </div>
          </div>
          <div className='flex border border-gray-200 px-3 py-2 justify-center items-center rounded-md bg-linear-(--color-gradient)'>
            <div className='mr-3'>
              <img src={Images.Doctor} alt="Doctoer" className='w-10' />
            </div>
            <div>
              <h1 className='text-gray-600'>Total Patients</h1>
              <p className='font-bold text-blue-700'>{patientsList.length}</p>
            </div>
          </div>
        </div>
        <div className='w-fit shrink-0 flex flex-col gap-1 bg-gray-100 px-2 py-2 rounded-md mx-auto mt-3'>
          <h4 className='font-medium text-md text-gray-600'>New Doctors</h4>
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
      </section>
    </>
  )
}

export default Dashboard;