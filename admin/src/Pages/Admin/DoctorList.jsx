import React, { useContext, useEffect, useState } from 'react';
import { Images } from '../../Components/Images';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function DoctorList() {

  const { BackendUrl } = useContext(AdminContext);
  const [doctorsList, setDoctorsList] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    const feachDoctors = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/api/doctor/list`);
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
  }, [BackendUrl]);


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
    <> {
      load ? (<p>Data Feaching Please Wait...</p>) : (
        <section className='w-full '>
          <div className='relative z-[-1]'>
            <p className='absolute top-2 right-2 -translate-x-1/2 text-(--color-text1)'>Total Doctor:<span className='text-(--color-text)'>{doctorsList.length}</span></p>
            <h1 className='flex justify-center py-2 text-(--color-primary) font-semibold text-md mx-auto'>DOCTOR LIST</h1>
          </div>

          <div className='h-[85vh] overflow-y-auto flex flex-col gap-2 p-4 px-[5%]'>
            {doctorsList.map((item, index) => {
              return (
                <div key={index} className='flex gap-2 border border-gray-200 p-1 rounded-md'>
                  <img src={item.image} alt="img" className='w-30 rounded-sm' />
                  <div>
                    <p>{item.name}</p>
                    <p>{item.email}</p>
                    <p>{item.degree}</p>
                    <p>{item.speciality}</p>
                  </div>
                  <button className='px-4 py-2 bg-red-500 text-white ml-auto cursor-pointer h-fit my-auto mr-3 rounded-md' onClick={() => onDeleteHandle(item._id)}>Delete</button>
                </div>
              )
            })}
          </div>
        </section>)
    }

    </>
  )
}

export default DoctorList