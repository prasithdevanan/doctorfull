import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../component/CreateContext';
import { socket } from '../socket/socket';


function Notification() {
  const { data } = useContext(AppContext);
  useEffect(() => {
    console.log(data);
  }, [data]);

  // Mark as seen
  useEffect(() => {
    if (!data || !data.length) return;
    const ids = data.map((data) => data.notificationId);
    console.log(ids);
    socket.emit("user_seen", { notificationId: ids });
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
                className="relative overflow-hidden bg-white/80 backdrop-blur-lg border border-gray-300 rounded-3xl p-5 shadow-lg shadow-gray-200/50 hover:shadow-2xl transition-all duration-300 mb-4 "
              >

                {/* Patient Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 tracking-wide">
                      {data.details.data.patientName}
                    </h3>

                    <p className="text-sm text-gray-400 mt-1">
                      Appointment Details
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`
        px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm
        ${data.status === "Accepted"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : data.status === "Rejected"
                          ? "bg-red-100 text-red-600 border border-red-200"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      }`}
                  >
                    {data.status}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-4"></div>

                {/* Date & Time */}
                <div className="flex flex-wrap items-center gap-4 text-sm">

                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <i className="bi bi-calendar3 text-lg"></i>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs">Date</p>
                      <p className="font-medium text-gray-700">
                        {data.details.data.appointmentDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <i className="bi bi-clock text-lg"></i>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs">Time</p>
                      <p className="font-medium text-gray-700">
                        {data.details.data.appointmentTime}
                      </p>
                    </div>
                  </div>

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