import React, { use, useContext, useState, useEffect } from 'react'
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { Images } from '../../Components/Images';

function Dashboard() {
  const { BackendUrl } = useContext(AdminContext);

  const [doctorsList, setDoctorsList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);

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



  return (
    <>
      <section className='w-full'>
        <div className='flex mt-3 justify-center gap-3'>
          <div className='flex border border-gray-200 px-3 py-2 justify-center items-center rounded-md bg-linear-(--color-gradient)'>
            <div className='mr-3'>
              <img src={Images.Doctor} alt="Doctoer" className='w-10'/>
            </div>
            <div>
              <h1 className='text-gray-600'>Total Doctor</h1>
              <p className='font-bold text-blue-700'>{doctorsList.length}</p>
            </div>
          </div>
          <div className='flex border border-gray-200 px-3 py-2 justify-center items-center rounded-md bg-linear-(--color-gradient)'>
            <div className='mr-3'>
              <img src={Images.Doctor} alt="Doctoer" className='w-10'/>
            </div>
            <div>
              <h1 className='text-gray-600'>Total Patients</h1>
              <p className='font-bold text-blue-700'>{patientsList.length}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Dashboard;