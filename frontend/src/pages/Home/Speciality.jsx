import React from 'react'
import { speciality } from '../../assets/data';
import { Link } from 'react-router-dom';

function Speciality() {
    return (
        <>
            {/* //------------------------------------------Speciality----------------------- */}

            <section className='mt-[6%] flex flex-col justify-center items-center gap-10' id='Speciality'>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h1 className='text-3xl font-semibold'>Find by Speciality </h1>
                    <p className='font-light'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
                </div>
                <div className='flex flex-wrap justify-center max-w-[80%] gap-6 sm:max-w[90%]'>
                    {
                        speciality.map((item, index) => (
                            <Link to={'/doctor'} key={index} state={{ speciality: item }}>
                                <div className='flex flex-col items-center gap-2 hover:translate-y-[-10px] transition-all duration-300 cursor-pointer'>
                                    <div className={`bg-[linear-gradient(180deg,_#AFC1DC_0%,_#E2E5ED_100%)] min-w-15 h-15 flex items-center justify-center rounded-full`}>
                                        <img src={item.img} alt="img" className='w-8' />
                                    </div>
                                    <p>{item.name}</p>
                                </div>
                            </Link>

                        ))
                    }
                </div>
            </section>
        </>
    )
}

export default Speciality