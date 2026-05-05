import React, { useEffect, useContext, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { AdminContext } from '../../../context/AdminContext';
import axios from 'axios';

function PatientDetails() {
  const { BackendUrl } = useContext(AdminContext);
  const { id } = useParams();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  ///store the data
  const element = location.state;
  console.log(element);


  //check the previose page
  useEffect(() => {
    if (!element) {
      window.location.href = "/";
    }
  }, [])



  // fetch the patient appointment details

  useEffect(() => {

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BackendUrl}/api/patient/appointment/patient`, { params: { patientEmail: element.email } });
        if (!res.data.success) {
          console.log(res.data.message);
          return;
        }
        console.log(res.data.appointments);
        setAppointments(res.data.appointments);
      } catch (error) {
        console.log(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }

    }
    if (element) {
      fetch();
    }

  }, [element]);

  return (
    <>
      <section className="h-[calc(100vh-64px)] w-full bg-gray-50 p-6 flex flex-col items-center gap-6 overflow-y-auto">

        {/* ================= Patient Card ================= */}
        <div className="bg-white shadow-sm border border-gray-300 rounded-2xl p-6 w-full max-w-md">

          {element.image && (
            <img
              src={element.image}
              alt="Patient"
              className="w-24 h-24 rounded-full mx-auto object-cover border mb-4"
            />
          )}

          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {element.name}
            </h1>
            <p className="text-sm text-gray-500">
              Patient ID: {element.patientId}
            </p>
          </div>

          <div className="mt-5 space-y-2 text-sm text-gray-700 border-t pt-4">

            <p><span className="text-gray-500">Email:</span> {element.email}</p>
            <p><span className="text-gray-500">Phone:</span> {element.phone || "-"}</p>

            {element.gender && (
              <p><span className="text-gray-500">Gender:</span> {element.gender}</p>
            )}

            {element.DOB && (
              <p><span className="text-gray-500">DOB:</span> {element.DOB}</p>
            )}

          </div>
        </div>

        {/* ================= Appointments Section ================= */}
        <div className="w-full max-w-5xl">

          {
            loading ? (
              <p>Loading..</p>
            ) :(
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Appointments
                  </h2>

                  <span className="text-xs text-gray-500">
                    {appointments.length} total
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  {appointments.length > 0 ? (
                    appointments.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                      >

                        {/* Doctor */}
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Dr. {item.doctorName}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {item.doctorSpeciality || "General"}
                          </p>
                        </div>

                        {/* Patient Info */}
                        <div className="mb-3 border-t border-gray-200 pt-3 space-y-1 text-sm text-gray-700">
                          <p className='flex justify-between'><span className="text-gray-500">Patient:</span> {item.patientName}</p>
                          <p className='flex justify-between'><span className="text-gray-500">Phone:</span> {item.patientPhone}</p>
                          <p className='flex justify-between'><span className="text-gray-500">Reason:</span> {item.reason}</p>
                        </div>

                        {/* Info */}
                        <div className="space-y-2 text-sm text-gray-700">

                          <div className="flex justify-between">
                            <span className="text-gray-500">Date</span>
                            <span className="font-medium">{item.appointmentDate}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-500">Time</span>
                            <span className="font-medium">{item.appointmentTime}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-500">Fees</span>
                            <span className="font-medium">₹{item.fees}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-500">Payment</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${item.paymentStatus === "unpaid"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                              }`}>
                              {item.paymentStatus}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${item.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                              }`}>
                              {item.status}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-500">Payment ID</span>
                            <span className="text-xs break-all font-medium">
                              {item.paymentId}
                            </span>
                          </div>

                        </div>

                        {/* Actions */}
                        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">

                          <span className="text-xs text-gray-400">
                            Appointment #{index + 1}
                          </span>

                        </div>

                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No appointments found
                    </p>
                  )}

                </div>
              </>
            )
          }




        </div>

      </section>
    </>
  )
}

export default PatientDetails;