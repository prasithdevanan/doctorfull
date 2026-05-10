import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../component/CreateContext';


function Notification() {
  const { data } = useContext(AppContext);
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <>
      <div className='px-4'>
        <h1 className='text-2xl font-semibold mb-4'>Notifications</h1>

        {
          data.map((data, index) => {
            return (
              <div
                key={index}
                className='bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 mb-3'
              >

                {/* Patient Name */}
                <h3 className='text-lg font-semibold text-gray-800'>
                  {data.details.data.patientName}
                </h3>

                {/* Date & Time */}
                <div className='flex items-center gap-3 mt-2 text-sm text-gray-500'>
                  <p className='flex items-center gap-1'>
                    <i className="bi bi-calendar3"></i>
                    {data.details.data.appointmentDate}
                  </p>

                  <p className='flex items-center gap-1'>
                    <i className="bi bi-clock"></i>
                    {data.details.data.appointmentTime}
                  </p>
                </div>

                {/* Status */}
                <div className='mt-4'>
                  <span
                    className={`
                px-4 py-1 rounded-full text-sm font-medium
                ${data.status === "Accepted"
                        ? "bg-green-100 text-green-600"
                        : data.status === "Rejected"
                          ? "bg-red-100 text-red-500"
                          : "bg-yellow-100 text-yellow-600"
                      }
            `}
                  >
                    {data.status}
                  </span>
                </div>

              </div>
            )
          })
        }
      </div >
    </>
  )
}

export default Notification;