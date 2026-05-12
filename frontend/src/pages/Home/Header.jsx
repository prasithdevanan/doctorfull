import React, { useEffect, useState } from 'react';
import Button from '../../component/Button';
import { Images } from '../../assets/img';

const useCountAnimation = (end, duration) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
       
        const stepTiming = duration / end;
        console.log(stepTiming);
        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) {
                clearInterval(timer);
            }


        }, stepTiming);

        return () => clearInterval(timer);
    },[end, duration]);

    return count;
}

function Header() {
    return (
        <>
            {/* //------------------------------------------header----------------------- */}
            <header className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-[#f7fafc]">

                <div className="max-w-8xl mx-auto bg-white rounded-[28px] sm:rounded-[40px] overflow-hidden border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">

                    <div className="grid lg:grid-cols-2 items-center">

                        {/* LEFT CONTENT */}
                        <div className="p-6 sm:p-10 lg:p-16">

                            {/* Badge */}
                            <div className="w-fit px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-5">
                                <p className="text-xs sm:text-sm font-medium text-blue-600">
                                    Trusted Healthcare Platform
                                </p>
                            </div>

                            {/* Heading */}
                            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                                Find The Right <br />

                                <span className="text-blue-600">
                                    Doctor For Your Care
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="mt-5 text-gray-500 text-sm sm:text-base lg:text-lg leading-7 max-w-xl">
                                Connect with experienced healthcare specialists and
                                book appointments easily with a seamless digital experience.
                            </p>

                            {/* CTA */}
                            <div className="flex flex-wrap items-center gap-4 mt-8">

                                <a href="#Speciality">

                                    <button className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 sm:px-7 py-3 sm:py-4 rounded-2xl font-medium flex items-center gap-2 transition-all duration-300 text-sm sm:text-base">

                                        Book Appointment

                                        <i className="bi bi-arrow-right text-lg"></i>

                                    </button>

                                </a>

                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-12">

                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        {useCountAnimation(10, 100)+"K+"}
                                    </h3>

                                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                        Active Patients
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        {useCountAnimation(300, 1000)+"+"}
                                    </h3>

                                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                        Expert Doctors
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        24/7
                                    </h3>

                                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                        Online Support
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* RIGHT IMAGE */}
                        <div className="hidden lg:flex relative lg:min-h-full bg-cyan-50 items-center justify-center p-6 sm:p-8">

                            {/* Circle Background */}
                            <div className="absolute w-[280px] h-[280px] sm:w-[200px] sm:h-[200px] lg:w-[300px] lg:h-[300px] bg-blue-400 rounded-full blur-3xl opacity-40"></div>

                            {/* Doctor Image */}
                            <img
                                src={Images.Header}
                                alt="doctor"
                                className="relative z-10 w-full max-w-[250px] sm:max-w-sm lg:max-w-lg object-contain"
                            />

                            {/* Floating Card */}
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 bg-white rounded-2xl shadow-lg px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3 w-[90%] sm:w-auto max-w-xs">

                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center">

                                    <i className="bi bi-check2-circle text-green-600 text-lg sm:text-xl"></i>

                                </div>

                                <div>
                                    <h4 className="font-semibold text-sm sm:text-base text-gray-800">
                                        Verified Specialists
                                    </h4>

                                    <p className="text-xs sm:text-sm text-gray-500">
                                        Trusted medical professionals
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </header>
        </>
    )
}

export default Header;