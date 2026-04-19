import React from 'react';
import Button from '../../component/Button';
import { Images } from '../../assets/img';

function Header() {
    return (
        <>
            {/* //------------------------------------------header----------------------- */}
            <header className="flex justify-center px-4">

                <div className="w-full max-w-[1200px] mx-auto px-5 md:px-10 py-10 
    bg-linear-(--color-primary-gradient) 
    flex flex-col md:flex-row items-center justify-between 
    gap-8 rounded-2xl">

                    {/* LEFT CONTENT */}
                    <div className="flex flex-col gap-5 text-center md:text-left">

                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight text-(--color-text-color)">
                            Book Appointment <br className="hidden sm:block" />
                            With Trusted Doctors
                        </h1>

                        <div className="flex flex-col sm:flex-row items-center md:items-start gap-3">

                            <img
                                src={Images.Group}
                                alt="group"
                                className="w-16 sm:w-20 md:w-16 object-contain"
                            />

                            <p className="text-sm sm:text-base font-light text-(--color-text-color) max-w-md">
                                Simply browse through our extensive list of trusted doctors,
                                schedule your appointment hassle-free.
                            </p>

                        </div>

                        <a href="#Speciality" className="w-fit mx-auto md:mx-0">
                            <Button
                                children="Book Appointment"
                                primary="bg-(--color-text-color) px-5 py-2 rounded-full flex items-center gap-2 text-(--color-primary) hover:scale-105 transition duration-300"
                                icon={<i className="bi bi-arrow-right-short text-2xl"></i>}
                            />
                        </a>

                    </div>

        
                    {/* <div className="hidden md:flex w-[40%] justify-end">
                        <img
                            src={Images.Header}
                            alt="doctor"
                            className="w-full max-w-sm object-contain"
                        />
                    </div> */}

                </div>

            </header>
        </>
    )
}

export default Header;