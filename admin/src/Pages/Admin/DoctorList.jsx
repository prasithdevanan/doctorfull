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
    <>
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
        <section className="w-full px-4 sm:px-6 py-4 bg-gray-50 min-h-screen">

          {/* ===== HEADER ===== */}
          <div className="flex items-center justify-between mb-6">

            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Doctors
              </h1>
              <p className="text-sm text-gray-500">
                Total: <span className="font-semibold text-gray-800">{doctorsList.length}</span>
              </p>
            </div>

            {/* optional button */}
            {
              aToken && <button className="cursor-pointer hidden sm:block px-4 py-2 text-sm bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition" onClick={() => navigate('/add-doctor')}>
                + Add Doctor
              </button>
            }


          </div>


          {/* ===== LIST ===== */}

          <div className="h-[75vh] overflow-y-auto space-y-3 pr-1">

            {doctorsList.map((item, index) => (
              <div
                key={index}
                className="group flex flex-col sm:flex-row gap-4 sm:items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >

                {/* Image */}
                <img
                  src={item.image}
                  alt="doctor"
                  className="w-full sm:w-24 h-24 rounded-lg object-cover border"
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
                    onClick={() => onDeleteHandle(item._id)}
                    className="cursor-pointer px-4 py-2 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>

        </section>
      )}
    </>
  )
}

export default DoctorList