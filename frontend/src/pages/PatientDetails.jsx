import React, { useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'

function PatientDetails() {
    const location = useLocation();
    const navigate = useNavigate();

    ///change the screen from the previous
    useEffect(() => {
        if (!location?.state?.fromBooking) {
            navigate('/doctor');
            return;
        }
    }, [])

    const element = location?.state?.element || false;
    const selectDate = location?.state?.selectDate;
    const selectTime = location?.state?.selectTime;
    console.log(element);


    const submitHandle = (e) => {
        e.preventDefault();
        console.log(e.target)
    }

    return (
        <>
            <div>
                <form action="" className='grid grid-cols-2' onSubmit={submitHandle}>
                    <div>
                        <p>Patient Name</p>
                        <input
                            type="text"
                            placeholder='Enter Patient Name'
                            className='bg-(--color-input) px-2 py-2 border border-gray-200 rounded-md' />
                    </div>
                    <div>
                        <p>PatientPhone</p>
                        <input type="tel"
                            maxLength={10}
                            placeholder='Enter Patient Name'
                            className='bg-(--color-input) px-2 py-2 border border-gray-200 rounded-md' />
                    </div>
                    <div>
                        <p>Reason</p>
                        <textarea name="" id=""
                            placeholder='Enter Reason'
                            className='bg-(--color-input) px-2 py-2 border border-gray-200 rounded-md w-full' />
                    </div>
                    <div>
                        <p>Doctor Name</p>
                        <input
                            type="text"
                            placeholder='Enter Patient Name'
                            className='bg-(--color-input) px-2 py-2 border border-gray-200 rounded-md focus:hidden cursor-default'
                            readOnly />
                    </div>
                    <button className='px-4 py-2 bg-(--color-primary)' type='submit'>Submit Details</button>
                </form>
                <div className='flex justify-center mt-3'>




                </div>
            </div>
        </>
    )
}

export default PatientDetails