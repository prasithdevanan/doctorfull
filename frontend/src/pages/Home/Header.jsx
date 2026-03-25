import React from 'react';
import Button from '../../component/Button';
import { Images } from '../../assets/img';

function Header() {
    return (
        <>
            {/* //------------------------------------------header----------------------- */}
            < header className='flex justify-center' >

                <div className="w-full md:w-[90%] sm:w-[95%] lg:w-[80%] mx-auto px-6 sm:px-6 md:px-10 py-10 bg-linear-(--color-primary-gradient) flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 rounded-2xl">
                    <div className='py-5 flex gap-4 flex-col'>
                        <h1 className='text-2xl md:text-4xl font-semibold leading-tight flex flex-col text-(--color-text-color)'>
                            Book Appointment <br />With Trusted Doctors</h1>
                        <div className='flex gap-2'>
                            <img src={Images.Group} alt="img" className='w-[15%] object-contain' />
                            <p className='text-1xl font-light text-(--color-text-color)'>Simply browse through our extensive list of trusted doctors,
                                schedule your appointment hassle-free.</p>
                        </div>
                        <a href="#Speciality" className='w-fit'>
                            <Button children='Book Appointment' primary='bg-(--color-text-color) px-4 py-2 rounded-full flex gap-2 items-center text-(--color-primary) hover:bg-(--color-text-color) w-fit hover:scale-105 cursor-pointer transition ease-in-out duration-300' icon={<i className="bi bi-arrow-right-short text-2xl flex items-center"></i>} alt="logo" />
                        </a>

                    </div>

                    <div className='w-1/2 relative h-full'>
                        <img src={Images.Header} alt="logo" className='w-full md:absolute bottom-0 right-0' />
                    </div>
                </div>

            </header >
        </>
    )
}

export default Header;