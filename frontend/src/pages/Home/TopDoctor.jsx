import React from 'react';
import DoctorList from '../../component/DoctorList';
import { doctorList } from '../../assets/data';

function TopDoctor() {
    const visibleDoctor = doctorList.slice(0, 5);
    return (
        <>
            {/* //------------------------------------------Doctors List----------------------- */}

            <section className='flex flex-col justify-center items-center mt-[6%]'>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h1 className='text-3xl font-semibold'>Top Doctors to Book</h1>
                    <p className='font-light'>Simply browse through our extensive list of trusted doctors.</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-5 sm:grid-cols-2 justify-between max-w-[90%]  gap-3 mt-5 py-2 '>
                    <DoctorList selectSpeciality={visibleDoctor} />
                </div>
            </section>

        </>
    )
}

export default TopDoctor;