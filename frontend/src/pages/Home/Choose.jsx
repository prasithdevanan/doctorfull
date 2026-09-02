import React, { useRef, useEffect } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Choose() {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);

    useEffect(() => {
        gsap.from(titleRef.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%", // when section enters screen
                toggleActions: "restart none none reset",
                invalidateOnRefresh: true,
            },
            opacity: 0,
            y: 80,
            duration: 1,
            ease: "power4.out",
        });
    }, []);

    useEffect(() => {
        gsap.from(".features-card", {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                toggleActions: "restart none none reset",
                invalidateOnRefresh: true
            },
            opacity: 0,
            delay: 0.2,
            y: 80,
            duration: 1,
            ease: "power4.out",
        })
    }, [])


    return (
        <>
            <section className="mt-16 sm:mt-20 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gradient-to-b from-(--color-primary)/5 via-white to-white" ref={sectionRef}>

                {/* Heading */}
                <div className="flex flex-col items-center gap-3 text-center max-w-2xl mx-auto" ref={titleRef}>
                    <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-(--color-primary)">
                        Why Metix
                    </span>

                    <h1 className="text-3xl font-semibold text-slate-800">
                        Why <span className="text-(--color-primary)">Choose</span> Us
                    </h1>

                    <p className="text-sm sm:text-base font-light leading-6 text-slate-500">
                        Committed to providing premium healthcare accessibility
                    </p>
                </div>

                {/* Features */}
                <div className="features-card w-full max-w-6xl mx-auto mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">

                    {/* Verified Doctors */}
                    <div className="flex flex-col items-center text-center border border-slate-200 rounded-xl p-6 sm:p-7 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-(--color-primary)/20 hover:shadow-[0_4px_16px_rgba(15,23,42,0.07)] cursor-pointer">
                        <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-(--color-primary)/10 flex items-center justify-center">
                            <i className="bi bi-shield-check text-(--color-primary) text-2xl"></i>
                        </span>

                        <h2 className="mt-4 text-base sm:text-lg font-semibold text-slate-700">
                            Verified Doctors
                        </h2>

                        <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-500 max-w-xs">
                            All our specialists go through a rigorous verification process.
                        </p>
                    </div>

                    {/* Easy Booking */}
                    <div className="flex flex-col items-center text-center border border-slate-200 rounded-xl p-6 sm:p-7 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-(--color-primary)/20 hover:shadow-[0_4px_16px_rgba(15,23,42,0.07)] cursor-pointer">
                        <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-(--color-primary)/10 flex items-center justify-center">
                            <i className="bi bi-calendar3 text-(--color-primary) text-2xl"></i>
                        </span>

                        <h2 className="mt-4 text-base sm:text-lg font-semibold text-slate-700">
                            Easy Booking
                        </h2>

                        <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-500 max-w-xs">
                            Book appointments in just a few clicks from any device.
                        </p>
                    </div>

                    {/* 24/7 Support */}
                    <div className="flex flex-col items-center text-center border border-slate-200 rounded-xl p-6 sm:p-7 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-(--color-primary)/20 hover:shadow-[0_4px_16px_rgba(15,23,42,0.07)] cursor-pointer">
                        <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-(--color-primary)/10 flex items-center justify-center">
                            <i className="bi bi-headset text-(--color-primary) text-2xl"></i>
                        </span>

                        <h2 className="mt-4 text-base sm:text-lg font-semibold text-slate-700">
                            24/7 Support
                        </h2>

                        <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-500 max-w-xs">
                            Our dedicated support team is available around the clock.
                        </p>
                    </div>

                </div>
            </section>
        </>
    )
}

export default Choose;