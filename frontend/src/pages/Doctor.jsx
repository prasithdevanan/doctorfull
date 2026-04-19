import React, { useEffect, useState } from 'react';
import DoctorList from '../component/DoctorList';
import Button from '../component/Button';
import { useLocation } from 'react-router-dom';
import { speciality } from '../assets/data';
import { useDoctors } from '../component/DataFeach';

function Doctor() {
  const doctorList = useDoctors();
  const location = useLocation();

  // const selectSpeciality = location.state ? location.state.speciality : null;
  const [selectSpeciality, setSelectSpeciality] = useState(location.state ? location.state.speciality : null);


  const filterDoctor = selectSpeciality ? doctorList.filter((doc) => doc.speciality === selectSpeciality.name) : doctorList;


  const [show, setShow] = useState(false);
  const btnName = show ? "Show Less" : "Show More";
  const visibleDoctor = show ? filterDoctor : filterDoctor.slice(0, 5);
  return (
    <>
      <section>
        <div className="group relative w-fit ml-3`">

          <Button
            children="Filter"
            primary="bg-(--color-text1) px-4 py-2 rounded-full flex gap-2 items-center text-(--color-text-color) hover:scale-105 transition duration-300 cursor-pointer"
            icon={<i className="bi bi-filter"></i>}
          />

          {/* Dropdown */}
          <div className="hidden group-hover:block absolute top-0 left-0 z-50 pt-14">
            <div className="bg-(--color-bg) rounded-xl shadow-md border border-gray-100 overflow-hidden min-w-[180px]">

              <Button
                children="All Doctors"
                primary="px-4 cursor-pointer py-2 text-sm text-[var(--color-text)] w-full text-left hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-primary)] transition"
                onclick={() => setSelectSpeciality(null)}
              />

              {
                speciality.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-(--color-bg-hover) hover:text-(--color-primary) transition" onClick={() => setSelectSpeciality(item)}
                  >
                    <button className='cursor-pointer'>
                      {item.name}
                    </button>
                  </div>
                ))
              }

            </div>
          </div>

        </div>
      </section>

      <section className="flex flex-col items-center mt-6">

        <p className="text-lg font-medium text-gray-700 mb-4 tracking-wide">
          {selectSpeciality ? selectSpeciality.name : "General Doctor"}
        </p>

        <DoctorList selectSpeciality={visibleDoctor} />

        {
          filterDoctor.length > 6 && (
            <Button
              children={btnName}
              primary="bg-linear-(--color-primary-gradient) px-5 py-2 rounded-full text-white hover:opacity-90 hover:scale-105 transition duration-300 mt-6 mb-6 cursor-pointer"
              onclick={() => setShow(show ? false : true)}
            />
          )
        }

      </section>

    </>
  )
}

export default Doctor;