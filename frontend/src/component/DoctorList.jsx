import React from 'react'
import { Images } from '../assets/img';
import { Link } from 'react-router-dom';


function DoctorList({ selectSpeciality, isHome }) {
    const newFilter = selectSpeciality ? selectSpeciality : '';

    return (
        <>
            {
                newFilter.length === 0 ?
                    <div className='flex w-full flex-col justify-center items-center min-h-[400px] mt-6 px-6'>
                        <img
                            src={Images.DoctorNotFound}
                            alt="No doctors found"
                            className={`${isHome ? 'w-1/3 mx-auto' : 'w-1/3'} max-w-[400px] opacity-90`}
                        />

                        <h1 className='text-2xl font-semibold text-gray-700 mt-6'>
                            No Doctors Found
                        </h1>

                        <p className='text-sm text-gray-400 mt-2'>
                            Try selecting a different speciality
                        </p>
                    </div>
                    :
                    <div
                        className={`${isHome
                            ? "no-scrollbar flex overflow-x-auto gap-5 px-5 py-5 items-stretch xl2:justify-center"
                            : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 px-5 gap-5 max-w-[1500px]"
                            }`}
                    >
                        {
                            newFilter.map((item, index) => {
                                return (
                                    <Link
                                        to={`/doctor/${item._id}`}
                                        key={index}
                                        state={{ element: item, fromBooking: true }}
                                        className='flex h-full'
                                    >

                                        <div
                                            className={`${isHome
                                                ? 'flex flex-col justify-between w-64 cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
                                                : 'flex flex-col justify-between w-full cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
                                                }`}
                                        >

                                            {/* Doctor Image */}
                                            <div className='relative w-full overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50'>

                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className='w-full aspect-[4/3] object-contain transition-transform duration-500 hover:scale-105'
                                                />

                                            </div>

                                            {/* Doctor Details */}
                                            <div className='flex flex-col items-start w-full px-4 py-4 gap-3'>

                                                {/* Availability */}
                                                {
                                                    item.available
                                                        ?
                                                        <div className='flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full'>
                                                            <span className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></span>
                                                            <p className='text-emerald-600 text-xs font-medium'>
                                                                Available
                                                            </p>
                                                        </div>
                                                        :
                                                        <div className='flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-100 rounded-full'>
                                                            <span className='w-1.5 h-1.5 bg-red-500 rounded-full'></span>
                                                            <p className='text-red-500 text-xs font-medium'>
                                                                Unavailable
                                                            </p>
                                                        </div>
                                                }

                                                {/* Name & Speciality */}
                                                <div className='space-y-1'>
                                                    <h1 className='font-semibold text-gray-800 text-base leading-tight'>
                                                        {item.name}
                                                    </h1>

                                                    <p className='text-sm text-gray-500'>
                                                        {item.speciality}
                                                    </p>
                                                </div>

                                                {/* Book Button */}
                                                <button
                                                    className='w-full mt-1 py-2.5 px-4 bg-(--color-primary)/10 hover:bg-(--color-primary) text-(--color-primary) hover:text-white rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer'
                                                >
                                                    Book Now
                                                </button>

                                            </div>

                                        </div>

                                    </Link>
                                )
                            })
                        }
                    </div>
            }
        </>
    )
}

export default DoctorList;