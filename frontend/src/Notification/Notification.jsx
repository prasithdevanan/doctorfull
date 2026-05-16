import React, { use, useContext, useEffect, useState } from 'react';
import { AppContext } from '../component/CreateContext';
import { socket } from '../socket/socket';


function Notification() {
  const { data } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  // Mark as seen
  useEffect(() => {
    console.log('mark as seen');
    if (!data || !data.length) return setLoading(false);
    const ids = data.map((data) => data.notificationId);
    socket.emit("user_seen", { notificationId: ids });
    setLoading(false);
  }, [data]);

  return (
    <>
      <div className="px-4 sm:px-6 py-4 bg-gray-100 min-h-[calc(100vh-82px)]">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Notifications
        </h1>

        {loading ?
          <div className='w-full h-full flex justify-center items-center'>
            <p className=''>Loading...</p>
          </div>
          : data.map((item, index) => (
            <div
              key={index}
              className="bg-white/30 border border-gray-200 rounded-xl p-4 sm:p-5 mb-2 transition"
            >
              {/* Main Container */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                {/* Left Side */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6">

                  {/* Patient */}
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                      {item.details.data.patientName}
                    </h2>

                    <p className="text-sm text-gray-500">
                      Appointment Notification
                    </p>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg w-full sm:w-auto">
                    <i className="bi bi-calendar3 text-blue-600 text-lg"></i>

                    <div>
                      <p className="text-xs text-gray-400">Date</p>

                      <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        {item.details.data.appointmentDate}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg w-full sm:w-auto">
                    <i className="bi bi-clock text-purple-600 text-lg"></i>

                    <div>
                      <p className="text-xs text-gray-400">Time</p>

                      <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        {item.details.data.appointmentTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col justify-end sm:flex-row sm:items-center gap-3 sm:gap-4">

                  {/* Notification Time */}
                  <span className="text-sm text-gray-400 whitespace-nowrap">
                    {new Date(item.details.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>

                  {/* Status */}
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold text-center whitespace-nowrap
              ${item.status === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}

export default Notification;