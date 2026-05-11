import React from 'react';
import { Images } from '../assets/img';

function About() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">

      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">About Us</h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">Building a smarter healthcare experience</p>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* Image */}
        <div className="relative">
          <div className="absolute -inset-2 bg-(--color-primary) opacity-10 blur-2xl rounded-3xl"></div>

          <img
            src={Images.AboutImg}
            alt="about"
            className="relative w-full rounded-3xl shadow-lg object-cover"
          />
        </div>

        {/* Text */}
        <div className="space-y-6 text-gray-600 leading-relaxed">

          <p className="text-base">
            Welcome to Prescripto, your trusted healthcare platform designed to simplify
            appointment booking and health management in one seamless experience.
          </p>

          <p className="text-base">
            We are committed to building a modern healthcare ecosystem powered by
            technology, making it easier for patients to connect with qualified doctors
            without stress or delay.
          </p>

          {/* Vision Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

            <h3 className="font-semibold text-lg text-gray-900 mb-2">Our Vision</h3>

            <p className="text-gray-600 text-sm sm:text-base">
              To create a seamless healthcare experience where patients can easily access
              trusted doctors anytime, anywhere with complete convenience and confidence.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default About;