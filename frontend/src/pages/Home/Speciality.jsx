import React, { useEffect } from 'react'
import { speciality } from '../../assets/data';
import { Link } from 'react-router-dom';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
function Speciality() {
    useEffect(() => {
        const animation = gsap.from(".title-cards", {
            scrollTrigger: {
                trigger: ".title-cards",
                start: "top 80%",
                toggleActions: "restart none none reset",
                invalidateOnRefresh: true,
            },
            opacity: 0,
            x: -80,
            delay: 0.2,
            duration: 1,
            ease: "power4.out",
        });

        return () => {
            animation.scrollTrigger?.kill();
            animation.kill();
        };
    }, [])
    useEffect(() => {
        const cards = gsap.utils.toArray(".speciality-card");

        cards.forEach((card) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "restart none none reset",
                },
                opacity: 0,
                delay: 0.2,
                y: 30,
                duration: 0.3,
                ease: "power3.out",
                clearProps: "transform",
            });
        });
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);
    return (
        <>
            {/* -------//------------------------------------------Speciality----------------------- */}

            <section
                className="mt-16 px-4 flex flex-col items-center gap-10 title-cards"
                id="Speciality"
            >

                {/* -------Heading */}
                <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800">
                        Find by Speciality
                    </h1>

                    <p className="text-sm sm:text-base font-light text-gray-500">
                        Simply browse through our extensive list of trusted doctors,
                        schedule your appointment hassle-free.
                    </p>
                </div>

                {/* -------Speciality List */}
                <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl">

                    {speciality.map((item, index) => (
                        <Link
                            to="/doctor"
                            key={index}
                            state={{ speciality: item }}
                        >
                            <div className="flex flex-col items-center gap-2 cursor-pointer transform hover:-translate-y-2 transition duration-300 speciality-card">

                                {/* -------Icon */}
                                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-[linear-gradient(180deg,_#AFC1DC_0%,_#E2E5ED_100%)] shadow-sm">

                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="w-6 sm:w-8 object-contain"
                                    />
                                </div>

                                {/* -------Text */}
                                <p className="text-sm sm:text-base text-gray-700 text-center">
                                    {item.name}
                                </p>

                            </div>
                        </Link>
                    ))}

                </div>

            </section>
        </>
    )
}

export default Speciality