import React from 'react';
import { Images } from '../assets/img';

function About() {
  return (
    <>
      <section className='flex flex-col items-center'>
        <div>
          <h1 className='font-bold'>About Us</h1>
        </div>
        <div className='flex mx-auto px-8'>
          <div>
            <img src={Images.AboutImg} alt="img" className='rounded-md'/>
          </div>
          <div className='w-full px-3 py-2 flex justify-center items-center flex-col'>

            <p className='max-w-[90%]'>
              Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
              Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.
              <br />
              <span className='font-bold'>Our Vision</span> <br />
              Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
            </p>
          </div >
        </div>

      </section>

    </>
  )
}

export default About