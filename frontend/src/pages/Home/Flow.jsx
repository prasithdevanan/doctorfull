import React, { useEffect } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
function Flow() {

    useEffect(() => {
        gsap.from([".title-card", ".title-card-2"], {
            scrollTrigger: {
                trigger: ".title-card",
                start: "top 80%",
                toggleActions: "restart none none reset",
                invalidateOnRefresh: true,
            },
            opacity: 0,
            delay: 0.4,
            x: -80,
            duration: 1,
            ease: "power4.out",
        })
    }, [])



    return (
        <>
            <section className="mt-16 sm:mt-20 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto mb-20">

                <div className="w-full bg-white border border-slate-100 rounded-2xl sm:rounded-3xl px-5 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-12 shadow-[0_8px_35px_rgba(15,23,42,0.06)] title-card">

                    {/* ------- Heading */}
                    <div className="flex flex-col items-center gap-3 text-center max-w-2xl mx-auto">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-800">
                            How it works
                        </h1>

                        <p className="text-sm sm:text-base font-light leading-6 text-slate-500">
                            Three simple steps to your medical appointment
                        </p>
                    </div>

                    {/* ------- Steps */}
                    <div className="mt-10 sm:mt-12 flex flex-col md:flex-row items-center w-full title-card-2">

                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center w-full md:flex-1 px-3 sm:px-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary) text-lg sm:text-xl font-bold mb-3 transition-all duration-300 hover:scale-110">
                                01
                            </div>

                            <span className="text-sm sm:text-base text-(--color-text) font-semibold">
                                Search
                            </span>

                            <p className="mt-2 text-xs sm:text-sm leading-5 text-(--color-text1) max-w-[220px]">
                                Select specialists by name or specialty.
                            </p>
                        </div>

                        {/* Line */}
                        <div className="hidden md:block flex-1 border-t-2 border-dashed border-blue-200 mx-3 lg:mx-5" />

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center w-full md:flex-1 px-3 sm:px-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary) text-lg sm:text-xl font-bold mb-3 transition-all duration-300 hover:scale-110">
                                02
                            </div>

                            <span className="text-sm sm:text-base text-(--color-text) font-semibold">
                                Select
                            </span>

                            <p className="mt-2 text-xs sm:text-sm leading-5 text-(--color-text1) max-w-[220px]">
                                Choose your preferred doctor and available time slot.
                            </p>
                        </div>

                        {/* Line */}
                        <div className="hidden md:block flex-1 border-t-2 border-dashed border-blue-200 mx-3 lg:mx-5" />

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center w-full md:flex-1 px-3 sm:px-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary) text-lg sm:text-xl font-bold mb-3 transition-all duration-300 hover:scale-110">
                                03
                            </div>

                            <span className="text-sm sm:text-base text-(--color-text) font-semibold">
                                Confirm
                            </span>

                            <p className="mt-2 text-xs sm:text-sm leading-5 text-(--color-text1) max-w-[220px]">
                                Receive instant confirmation and appointment details.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default Flow