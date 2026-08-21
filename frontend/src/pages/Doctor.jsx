import React, { useEffect, useState } from 'react';
import DoctorList from '../component/DoctorList';
import Button from '../component/Button';
import { useLocation } from 'react-router-dom';
import { speciality } from '../assets/data';
import { useDoctors } from '../component/DataFeach';

function Doctor() {
  const { doctorList, loading } = useDoctors();
  const location = useLocation();

  const [filterOpen, setFilterOpen] = useState(false);
  const [show, setShow] = useState(false);

  const [selectSpeciality, setSelectSpeciality] = useState(
    location.state ? location.state.speciality : null
  );
  const sliceCount = window.innerWidth >= 1024 ? 5 : 4;

  const filterDoctor = selectSpeciality
    ? doctorList.filter((doc) => doc.speciality === selectSpeciality.name)
    : doctorList;

  const visibleDoctor = show
    ? filterDoctor
    : filterDoctor.slice(0, sliceCount);

  const btnName = show ? 'Show Less' : 'Show More';

  // Reset Show More when speciality changes
  useEffect(() => {
    setShow(false);
  }, [selectSpeciality]);

  return (
    <>
      {loading ?
        <div className="flex flex-col justify-center items-center h-[calc(100vh-72px)]">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-(--color-primary) rounded-full animate-spin"></div>
          <p className='mt-2 ml-2'>Loading...</p>
        </div> :
        <>
          <section className="relative flex items-center justify-center px-4 sm:px-6 py-5">

            {/* Filter - Left */}
            <div className="absolute left-4 sm:left-6">

              <div
                className="relative"
                onMouseEnter={() => setFilterOpen(true)}
                onMouseLeave={() => setFilterOpen(false)}
              >

                {/* Filter Button */}
                <button
                  type="button"
                  onClick={() => setFilterOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--color-text1) text-(--color-text-color) text-sm font-medium shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  <i className="bi bi-filter text-base"></i>

                  <span>Filter</span>

                  <i
                    className={`bi bi-chevron-down text-xs transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''
                      }`}
                  ></i>
                </button>


                {/* ================= DROPDOWN ================= */}
                {filterOpen && (
                  <div className="absolute top-full left-0 z-50 pt-2">

                    <div className="w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.12)]">

                      {/* Dropdown Header */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Speciality
                        </p>
                      </div>


                      {/* All Doctors */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectSpeciality(null);
                          setFilterOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 flex items-center justify-between text-sm text-left transition-colors cursor-pointer ${!selectSpeciality
                          ? 'bg-(--color-primary)/10 text-(--color-primary) font-medium'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                      >
                        <span>All Doctors</span>

                        {!selectSpeciality && (
                          <i className="bi bi-check2 text-(--color-primary)"></i>
                        )}
                      </button>


                      {/* Specialities */}
                      {speciality.map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setSelectSpeciality(item);
                            setFilterOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 flex items-center justify-between text-sm text-left transition-colors cursor-pointer ${selectSpeciality?.name === item.name
                            ? 'bg-(--color-primary)/10 text-(--color-primary) font-medium'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                          <span>{item.name}</span>

                          {selectSpeciality?.name === item.name && (
                            <i className="bi bi-check2 text-(--color-primary)"></i>
                          )}
                        </button>
                      ))}

                    </div>

                  </div>
                )}

              </div>
            </div>


            {/* ================= SELECTED SPECIALITY ================= */}
            <div className="text-center px-20 sm:px-24">
              <p className="text-base sm:text-lg font-semibold text-slate-700">
                {selectSpeciality ? selectSpeciality.name : 'General Doctor'}
              </p>

              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {filterDoctor.length} doctor{filterDoctor.length !== 1 ? 's' : ''} available
              </p>
            </div>

          </section>

          <section className="flex flex-col items-center px-4">

            <DoctorList selectSpeciality={visibleDoctor} />


            {/* ================= SHOW MORE ================= */}
            {filterDoctor.length > 5 && (
              <Button
                children={btnName}
                primary="bg-linear-(--color-primary-gradient) px-6 py-2.5 rounded-full text-white text-sm font-medium hover:opacity-90 hover:scale-105 transition-all duration-300 mt-8 mb-8 cursor-pointer shadow-sm"
                onclick={() => setShow((prev) => !prev)}
              />
            )}

          </section>
        </>

      }
    </>
  );
}

export default Doctor;