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
        <div className='group relative w-fit ml-3'>

          <Button children="Filter" primary="bg-(--color-text1) px-4 py-2 rounded-full flex gap-2 items-center text-(--color-text-color)  w-fit hover:scale-105 transition ease-in-out duration-300" icon={<i className="bi bi-filter"></i>} />


          <div className='hidden group-hover:block w-fit absolute top-0 left-0 z-50 p-2 rounded-[30px] pt-14'>
            <div className='bg-(--color-bg) rounded-md'>
              <Button children="All Doctors" primary=" px-4 py-2 flex gap-2 items-center text-(--color-text) w-full cursor-pointer hover:text-(--color-primary) hover:bg-(--color-bg-hover)" onclick={() => setSelectSpeciality(null)} />
              {
                speciality.map((item, index) => {
                  return (
                    <div className='px-4 py-2 hover:bg-(--color-bg-hover) hover:text-(--color-primary)' key={index} >
                      <button className='cursor-pointer' onClick={() => setSelectSpeciality(item)}>{item.name}</button>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </section>
      <section className='flex flex-col items-center'>
        {
          selectSpeciality ? <p>{selectSpeciality.name}</p> : <p>General Doctor</p>
        }
        <DoctorList selectSpeciality={visibleDoctor} />

        {
          filterDoctor.length > 6 && <Button children={btnName} primary='bg-linear-(--color-primary-gradient) px-4 py-2 rounded-full flex gap-2 items-center text-(--color-text-color) hover:bg-(--color-text-color) w-fit hover:scale-105 cursor-pointer transition ease-in-out duration-300 mt-6 mb-6' onclick={() => setShow(show ? false : true)} />
        }
      </section>

    </>
  )
}

export default Doctor;