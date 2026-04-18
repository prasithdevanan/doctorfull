import React from 'react'
import { Images } from '../assets/img';
import { doctorList } from '../assets/data';
import { Link } from 'react-router-dom';


function DoctorList({ selectSpeciality, isHome }) {

    const newFilter = selectSpeciality ? selectSpeciality : doctorList;

    return (
        <>
            {
                newFilter.length === 0 ?
                    <div className='flex w-full flex-col justify-center items-center h-full mt-3'>
                        <img src={Images.DoctorNotFound} alt="img" className={`${isHome ? 'w-1/3 mx-auto' : 'w-1/3'}`} />
                        <h1 className='text-2xl font-semibold text-gray-600 mt-5'>No Doctors Found</h1>
                    </div>
                    :
                    < div className={` ${isHome ? 'flex overflow-scroll gap-6 px-6 py-4 justify-baseline xl2:justify-center' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 px-6 gap-6'}`}>
                        {
                            newFilter.map((item, index) => {
                                return (
                                    <Link to={`/doctor/${item._id}`} key={index} state={{ element: item, fromBooking: true }} className='flex h-fit my-auto'>
                                        <div className={`${isHome ? 'flex flex-col justify-center w-64 cursor-pointer hover:scale-102 transition ease-in-out duration-300 bg-gray-100 rounded-2xl items-center': 'flex gap-4 items-center flex-col cursor-pointer hover:scale-102 transition ease-in-out duration-300 bg-gray-100 rounded-2xl'}`}>
                                            <img src={item.image} alt="img" className='w-full object-contain bg-blue-100 rounded-xl' />
                                            <div className='flex flex-col items-start w-full px-3 py-2 gap-2'>
                                                {
                                                    item.avilable ? <div className='px-2 bg-green-300 rounded-full'><p className='text-green-600 text-sm'>Available</p></div> : <div className='px-2 bg-red-100 rounded-full'><p className='text-red-500'>Unavailable</p></div>
                                                }
                                                <div>
                                                    <h1 className='font-bold text-gray-600'>{item.name}</h1>
                                                    <p className='font-light'>{item.speciality}</p>
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