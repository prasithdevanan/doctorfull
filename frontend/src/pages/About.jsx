import React from 'react';
import { Images } from '../assets/img';

function About() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-10  lg:h-[calc(100vh-80px)]">

      {/* ================= TITLE ================= */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">

        <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-(--color-primary) mb-3">
          <span className="w-6 h-px bg-(--color-primary)"></span>
          About Us
          <span className="w-6 h-px bg-(--color-primary)"></span>
        </span>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
          Building a smarter healthcare experience
        </h1>

        <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed">
          Making healthcare simpler, more accessible, and connected through technology.
        </p>

      </div>


      {/* ================= CONTENT ================= */}
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">

        {/* ================= IMAGE ================= */}
        <div className="relative flex justify-center">

          {/* Background Glow */}
          <div className="absolute w-[75%] h-[75%] bg-(--color-primary)/10 blur-3xl rounded-full"></div>

          {/* Image Container */}
          <div className="relative w-full max-w-lg">

            <img
              src={Images.AboutImg}
              alt="About Prescripto"
              className="w-full aspect-[4/3] object-cover rounded-3xl shadow-xl"
            />

            {/* Small Floating Badge */}
            <div className="absolute -bottom-4 left-4 sm:left-6 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3">

              <div className="w-9 h-9 rounded-xl bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center">
                <i className="bi bi-heart-pulse-fill text-sm"></i>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Healthcare
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  Made Simpler
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* ================= TEXT ================= */}
        <div className="space-y-6">

          <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-7">

            <p>
              Welcome to <span className="font-semibold text-gray-900">Prescripto</span>,
              your trusted healthcare platform designed to simplify appointment
              booking and health management in one seamless experience.
            </p>

            <p>
              We are committed to building a modern healthcare ecosystem powered by
              technology, making it easier for patients to connect with qualified
              doctors without stress or delay.
            </p>

          </div>


          {/* ================= VISION CARD ================= */}
          <div className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">

            {/* Accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-(--color-primary)"></div>

            <div className="flex items-start gap-4">

              <div className="shrink-0 w-10 h-10 rounded-xl bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center">
                <i className="bi bi-eye-fill"></i>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Our Vision
                </h3>

                <p className="text-sm sm:text-base text-gray-600 leading-6">
                  To create a seamless healthcare experience where patients can
                  easily access trusted doctors anytime, anywhere with complete
                  convenience and confidence.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default About;