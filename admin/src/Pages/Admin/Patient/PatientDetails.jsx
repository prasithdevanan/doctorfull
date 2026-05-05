import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom';

function PatientDetails() {

  //check the previose page
  useEffect(() => {
    if (!element) {
      window.location.href = "/";
    }
  }, [])

  const { id } = useParams();
  const location = useLocation();

  ///store the data
  const element = location.state;
  console.log(element);

  return (
    <>
      <section className="w-screen h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">

          {element.image && (
            <img
              src={element.image}
              alt="Patient"
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-100 mb-4"
            />
          )}

          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {element.name}
            </h1>
            <p className="text-sm text-gray-500">ID: {element.patientId}</p>
          </div>

          <div className="mt-6 space-y-2 text-sm text-gray-700">
            <p><span className="font-medium">Email:</span> {element.email}</p>
            <p><span className="font-medium">Phone:</span> {element.phone ? element.phone : "-"}</p>

            {element.gender && (
              <p><span className="font-medium">Gender:</span> {element.gender}</p>
            )}

            {element.DOB && (
              <p><span className="font-medium">DOB:</span> {element.DOB}</p>
            )}
          </div>

        </div>
      </section>
    </>
  )
}

export default PatientDetails;