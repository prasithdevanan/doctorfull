import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

function Appoiment() {
  const { BackendUrl, dToken, aToken } = useContext(AdminContext);
  const userId = localStorage.getItem('dEmail');

  const [data, setData] = useState([]);
  console.log(data);

  const filterData = data.filter((items) => items.doctorEmail.includes(userId));
  console.log(filterData);

  useEffect(() => {
    const feach = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/api/admin/appointment`);
        setData(res.data.appointments);

      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
    feach();
  }, [BackendUrl]);

  const content = dToken ? filterData : data;
  console.log(content);
  return (
    <>
      <section className="h-[90vh] overflow-auto w-full px-4 py-4">

        <h1 className="text-center text-xl sm:text-2xl font-semibold mb-4">
          Appointments
        </h1>

        <section className="overflow-y-auto">

          {content?.length > 0 ? (
            <div className="flex flex-col gap-3">

              {content.map((item, index) => (
                <div
                  key={index}
                  className="bg-(--color-white) border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row gap-3 shadow-sm"
                >

                  {/* Image */}
                  <div className="w-full sm:w-32 h-32 flex-shrink-0">
                    <img
                      src={item?.image}
                      alt="doctor"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-sm flex-1 relative">

                    <h2 className="font-semibold text-base">
                      {item?.doctorName}
                    </h2>

                    <p className="text-gray-600">
                      {item?.doctorSpeciality}
                    </p>

                    <p className="text-gray-600 break-all">
                      {item?.doctorEmail}
                    </p>

                    <div className="mt-2">
                      <p><span className="font-medium">Patient:</span> {item?.patientName}</p>
                      <p><span className="font-medium">Phone:</span> {item?.patientPhone}</p>
                    </div>

                    {/* Status */}
                    <span className={`mt-2 w-fit px-3 py-1 text-sm rounded-full absolute flex top-1/2 right-2 -translate-y-1/2
                ${item?.status === "Completed"
                        ? "bg-green-100 text-green-600"
                        : item?.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item?.status}
                    </span>

                  </div>

                </div>
              ))}

            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              No appointments found
            </div>
          )}

        </section>

      </section>
    </>
  )
}

export default Appoiment