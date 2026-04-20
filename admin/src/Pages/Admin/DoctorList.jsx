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
      load ? (
        <p className="text-center py-10 text-gray-500">
          Data fetching, please wait...
        </p>
      ) : (
        <section className="w-full px-3 sm:px-6">


          <div className="relative mb-4">
            <p className=" text-sm text-gray-500">
              Total Doctor:
              <span className="text-black font-semibold">
                {doctorsList.length}
              </span>
            </p>

            <h1 className="text-center text-lg sm:text-xl font-semibold text-blue-600">
              DOCTOR LIST
            </h1>
          </div>


          <div className="h-[80vh] overflow-y-auto flex flex-col gap-3">

            {doctorsList.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 sm:items-center border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
              >


                <img src={item.image} alt="doctor" className="w-full sm:w-28 h-28 object-cover rounded-md" />

                <div className="flex-1 text-sm space-y-1">
                  <p className="font-semibold text-base">{item.name}</p>
                  <p className="text-gray-600">{item.email}</p>
                  <p className="text-gray-600">{item.degree}</p>
                  <p className="text-gray-600">{item.speciality}</p>
                </div>


                <button onClick={() => onDeleteHandle(item._id)} className="w-full sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition cursor-pointer">
                  Delete
                </button>

              </div>
            ))}
          </div>
          <div>

          </div>
        </section>
      )
    }

    </>
  )
}

export default DoctorList