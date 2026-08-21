import React from 'react';
import DoctorList from '../../component/DoctorList';
import { useDoctors } from '../../component/DataFeach';

function TopDoctor() {
    const { doctorList, loading } = useDoctors();
    const visibleDoctor = doctorList.slice(0, 5);
    return (
        <>
            {/* //------------------------------------------Doctors List----------------------- */}

            <section className='flex flex-col justify-center items-center mt-[6%]'>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h1 className='text-3xl font-semibold'>Top
                        <span className='text-(--color-primary)'> Doctors</span> to Book</h1>
                    <p className='font-light text-center'>Simply browse through our extensive list of trusted doctors.</p>
                </div>
                <div className='mt-5 mb-4 overflow-hidden w-full flex justify-center items-center'>
                    <DoctorList selectSpeciality={visibleDoctor} isHome={true} loading={loading} />
                </div>
            </section>

        </>
    )
}

export default TopDoctor;