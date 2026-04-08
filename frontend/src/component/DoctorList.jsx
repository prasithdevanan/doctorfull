import React from 'react'
import { Images } from '../assets/img';
import { doctorList } from '../assets/data';
import { Link } from 'react-router-dom';

function DoctorList({ selectSpeciality }) {


    const newFilter = selectSpeciality ? selectSpeciality : doctorList;


    return (
        <>
            {
                newFilter.length === 0 ?
                    <div className='flex w-[50%] flex-col justify-center items-center h-full mt-3'>
                        <img src={Images.DoctorNotFound} alt="img" />
                        <h1 className='text-2xl font-semibold text-gray-600 mt-5'>No Doctors Found</h1>
                    </div>
                    :
                    < div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 px-6 gap-6'>
                        {
                            newFilter.map((item, index) => {
                                return (
                                    <Link to={`/doctor/${item.id}`} key={index} state={{ element: item, fromBooking: true }}>
                                        <div className='flex gap-4 items-center flex-col cursor-pointer hover:scale-105 transition ease-in-out duration-300 bg-gray-100 rounded-2xl'>
                                            <img src={item.img} alt="img" className='w-full object-contain bg-blue-100 rounded-xl' />
                                            <div className='flex flex-col items-start w-full px-3 py-2 gap-2'>
                                                {
                                                    item.available ? <div className='px-2 bg-green-300 rounded-full'><p className='text-green-600 text-sm'>Available</p></div> : <div className='px-2 bg-red-100 rounded-full'><p className='text-red-500'>Unavailable</p></div>
                                                }
                                                <div>
                                                    <h1 className='font-bold text-gray-600'>{item.name}</h1>
                                                    <p className='font-light'>{item.special}</p>
                                                </div>

                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div >

            }

        </>
    )
}

export default DoctorList;