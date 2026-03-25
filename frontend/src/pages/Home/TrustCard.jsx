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

                <section className='max-w-[80%] mx-auto mb-10 relative mt-[10%]'>
                    <div className='w-full min-h-[30vh] max-h-[30vh] bg-linear-(--color-primary-gradient) p-5 flex items-center rounded-lg'>
                        <div className='flex gap-2 flex-col ml-5'>
                            <h1 className='text-white font-semibold text-2xl'>Book Appointment <br />
                                With 100+ Trusted Doctors</h1>

                            <button className='bg-(--color-white) text-(--color-primary) px-4 py-2 rounded-full flex gap-1 justify-center items-center w-[70%] hover:scale-105 transition ease-in-out duration-300 cursor-pointer'  onClick={() => navigate('/login')}>Create Account</button>
                        </div>
                        <div>
                            <img src={Images.Doc1} alt="Img" className='absolute bottom-0 right-0 max-w-[30vh]' />
                        </div>
                    </div>

                </section>
            }

        </>
    )
}

export default TrustCard