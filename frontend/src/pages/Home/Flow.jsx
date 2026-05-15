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
    },[])



    return (
        <>
            <section className="mt-16 px-4 flex flex-col items-center mx-auto gap-10 md:w-[80%]">

                {/* -------Heading */}
                <div className="flex flex-col items-center gap-3 text-center max-w-2xl title-card">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800">
                        How it works
                    </h1>

                    <p className="text-sm sm:text-base font-light text-gray-500">
                        Three simple steps to your medical appointment
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full title-card-2">

                    {/* Step 1 */}
                    <div className="flex flex-col items-center w-full">
                        <h1 className="text-2xl font-bold w-16 h-16 flex justify-center rounded-full items-center bg-(--color-primary)/10 text-(--color-primary)">01</h1>
                        <span className="text-md text-(--color-text) font-semibold">Search</span>
                        <h2 className='text-center text-sm text-(--color-text1)'>Select for specialists by name, specialty.</h2>
                    </div>

                    {/* Line */}
                    <div className="min-w-16 w-full border-t-2 border-dashed border-blue-400 mx-2"></div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center w-full">
                        <h1 className="text-2xl font-bold w-16 h-16 flex justify-center rounded-full items-center bg-(--color-primary)/10 text-(--color-primary)">02</h1>
                        <span className="text-md text-(--color-text) font-semibold">Search</span>
                        <h2 className='text-center text-sm text-(--color-text1)'>Select for specialists by name, specialty.</h2>
                    </div>

                    <div className='min-w-16 w-full border-t-2 border-dashed border-blue-400 mx-auto'></div>
                    <div className="flex flex-col items-center w-full">
                        <h1 className="text-2xl font-bold w-16 h-16 flex justify-center rounded-full items-center bg-(--color-primary)/10 text-(--color-primary)">03</h1>
                        <span className="text-md text-(--color-text) font-semibold">Search</span>
                        <h2 className='text-center text-sm text-(--color-text1)'>Select for specialists by name, specialty.</h2>
                    </div>

                </div>
            </section>
        </>
    )
}

export default Flow