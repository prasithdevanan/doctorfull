import React from 'react';
import { Images } from '../assets/img';

function About() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">

      {/* -------------Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">About Us</h1>
      </div>

      {/* -------------Content */}
      <div className="flex flex-col md:flex-row items-center gap-10">

        {/* Image */}
        <div className="w-full md:w-1/2">
          <img
            src={Images.AboutImg}
            alt="about"
            className="w-full rounded-xl shadow-md object-cover"
          />
        </div>

        {/* ------------Text */}
        <div className="w-full md:w-1/2 text-gray-600 leading-relaxed space-y-4">
          <p>
            Welcome to Prescripto, your trusted partner in managing your healthcare
            needs conveniently and efficiently. At Prescripto, we understand the
            challenges individuals face when it comes to scheduling doctor
            appointments and managing their health records.
          </p>

          <p>
            Prescripto is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior service.
            Whether you're booking your first appointment or managing ongoing care,
            Prescripto is here to support you every step of the way.
          </p>

          <div>
            <h3 className="font-semibold text-lg text-black mb-1">
              Our Vision
            </h3>
            <p>
              Our vision at Prescripto is to create a seamless healthcare
              experience for every user. We aim to bridge the gap between patients
              and healthcare providers, making it easier for you to access the care
              you need, when you need it.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default About;