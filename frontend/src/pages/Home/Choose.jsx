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
            <section className="mt-16 px-4 flex flex-col items-center gap-10 bg-gradient-to-b from-(--color-primary)/5 via-white to-white py-6" ref={sectionRef}>
                <div className="flex flex-col items-center gap-3 text-center max-w-2xl" ref={titleRef}>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800">
                        Why Choose Us
                    </h1>

                    <p className="text-sm sm:text-base font-light text-gray-500">
                        Committed to providing premium healthcare accessibility
                    </p>
                </div>

                <div className='features-card w-full flex flex-wrap justify-center gap-4'>
                    <div className='flex flex-col border border-gray-200 rounded-xl p-4 sm:p-5 transition hover:bg-(--color-primary)/5 cursor-pointer max-w-[300px]  bg-white hover:shadow-[0_0_10px_0_rgba(0,0,0,0.1)]'>
                        <span className='p-3 px-4 rounded-full bg-(--color-primary)/10 flex mx-auto items-center justify-center gap-3'><i className="bi bi-shield-check text-(--color-primary) text-2xl"></i></span>
                        <h1 className="text-md  font-semibold text-gray-600 flex flex-col items-center pt-2">
                            Verified Doctors
                        </h1>
                        <p className="text-sm font-light text-gray-400 text-center">
                            All our specialists go through a rigorous verification process.
                        </p>
                    </div>
                    <div className='flex flex-col border border-gray-200 rounded-xl p-4 sm:p-5 transition bg-white hover:shadow-[0_0_10px_0_rgba(0,0,0,0.1)] hover:bg-(--color-primary)/5 cursor-pointer max-w-[300px]'>
                        <span className='p-3 px-4 rounded-full bg-(--color-primary)/10 flex mx-auto items-center justify-center gap-3'><i className="bi bi-calendar3 text-(--color-primary) text-2xl"></i></span>
                        <h1 className="text-md  font-semibold text-gray-600 flex flex-col items-center pt-2">
                            Easy Booking
                        </h1>
                        <p className="text-sm font-light text-gray-400 text-center">
                            Book appointments in just a few clicks from any device.
                        </p>
                    </div>
                    <div className='flex flex-col border border-gray-200 rounded-xl p-4 sm:p-5 transition hover:bg-(--color-primary)/5 cursor-pointer max-w-[300px]  bg-white hover:shadow-[0_0_10px_0_rgba(0,0,0,0.1)]'>
                        <span className='p-3 px-4 rounded-full bg-(--color-primary)/10 flex mx-auto items-center justify-center gap-3'><i className="bi bi-headset text-(--color-primary) text-2xl"></i></span>
                        <h1 className="text-md  font-semibold text-gray-600 flex flex-col items-center pt-2">
                            24/7 Support
                        </h1>
                        <p className="text-sm font-light text-gray-400 text-center">
                            Our dedicated support team is available around the clock.
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Choose;