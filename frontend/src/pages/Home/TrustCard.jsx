import React, { useContext, useState } from 'react';
import { AppContext } from '../../component/CreateContext';
import { Images } from '../../assets/img';
import { useNavigate } from 'react-router-dom';

function TrustCard() {
    const navigate = useNavigate();
    const { token, setToken } = useContext(AppContext);
    const [load, setLoad] = useState(<i className="bi bi-plus-circle-dotted"></i>);

    return (
        <>
            {/* //------------------------------------------Trusted Doctors Card----------------------- */}
            {
                !token &&
                <section className="w-[92%] sm:w-[88%] lg:w-[82%] max-w-6xl mx-auto mb-12 relative mt-[12%] sm:mt-[8%] lg:mt-[6%]">
                    <div className="relative w-full min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] bg-linear-(--color-primary-gradient) px-6 sm:px-10 lg:px-14 py-8 sm:py-10 flex items-center overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.18)]">

                        {/* Background Glow */}
                        <div className="absolute -top-20 -right-20 w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute -bottom-24 -left-20 w-64 h-64 rounded-full bg-blue-900/10 blur-3xl" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-start gap-4 sm:gap-5 max-w-[75%] sm:max-w-[65%] lg:max-w-[55%]">
                            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                                Trusted Healthcare
                            </span>

                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-semibold leading-tight tracking-tight">
                                Book Appointment <br className="hidden sm:block" />
                                With <span className="text-white/90">100+ Trusted Doctors</span>
                            </h1>

                            <p className="hidden sm:block text-xs md:text-sm text-white/70 leading-6 max-w-md">
                                Find the right specialist and schedule your appointment quickly and effortlessly.
                            </p>

                            <button
                                className="bg-(--color-white) text-(--color-primary) px-5 sm:px-7 py-2.5 sm:py-3 rounded-full flex gap-2 justify-center items-center text-xs sm:text-sm font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                onClick={() => navigate('/login')}
                            >
                                Create Account
                                <span className="text-base">→</span>
                            </button>
                        </div>

                        {/* Doctor Image */}
                        <div className="absolute bottom-0 right-3 sm:right-8 lg:right-12 hidden sm:block">
                            <img
                                src={Images.Doc1}
                                alt="Doctor"
                                className="w-[150px] sm:w-[200px] md:w-[240px] lg:w-[280px] object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </section>
            }
        </>
    )
}

export default TrustCard