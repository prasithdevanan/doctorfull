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
            <section className="mt-16 sm:mt-20 px-3 sm:px-5 lg:px-8 flex flex-col items-center gap-8 sm:gap-10" id="Speciality">
                {/* ------- Heading */}
                <div className="flex flex-col items-center gap-3 text-center max-w-[340px] sm:max-w-xl lg:max-w-2xl">
                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                        Explore Our Services
                    </span>

                    <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
                        Find by <span className="text-blue-600">Speciality</span>
                    </h1>

                    <p className="text-xs sm:text-sm md:text-base leading-6 text-slate-500">
                        Simply browse through our extensive list of trusted doctors and find the right specialist for your healthcare needs.
                    </p>
                </div>

                {/* ------- Speciality List */}
                <div className="w-full max-w-[340px] sm:max-w-2xl lg:max-w-7xl grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-nowrap gap-3 sm:gap-4">
                    {speciality.map((item, index) => (
                        <Link to="/doctor" key={index} state={{ speciality: item }} className="group w-full lg:flex-1">
                            <div className="relative min-h-[125px] sm:min-h-[140px] md:min-h-[150px] lg:min-h-[155px] flex flex-col items-center justify-center gap-2 sm:gap-3 px-2 sm:px-3 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-blue-100 hover:shadow-[0_15px_35px_rgba(37,99,235,0.12)]">

                                {/* Glow */}
                                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50/0 via-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Icon */}
                                <div className="relative z-10 w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100/70 shadow-inner transition-all duration-300 group-hover:scale-110">
                                    <img src={item.img} alt={item.name} className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain" />
                                </div>

                                {/* Name */}
                                <p className="relative z-10 text-[11px] sm:text-xs md:text-sm font-medium text-slate-700 text-center leading-4 sm:leading-5 transition-colors duration-300 group-hover:text-blue-600">
                                    {item.name}
                                </p>

                                {/* Indicator */}
                                <div className="absolute bottom-2 sm:bottom-2.5 w-0 h-0.5 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-7 sm:group-hover:w-8" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Speciality