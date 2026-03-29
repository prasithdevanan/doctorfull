import React from 'react';
import { Images } from '../../Components/Images';
import { AddDoctorLable } from '../../assets/Data';

function AddDoctor() {
  console.log(AddDoctorLable);
  return (
    <>
      <section className='w-full h-screen overflow-hidden'>
        <form action="" className='max-h-[90vh] overflow-y-auto p-4 bg-white shadow-md rounded-md'>
          <p>Add Doctor</p>

          <div>
            <label htmlFor="doc_img">
              <img src={Images.AdminProfile} alt="img" />
            </label>
            <input type="file" className='bg-amber-300' id='doc_img' hidden />
            <p htmlFor='doc_img'>Upload Doctor <br /> Picture</p>
          </div>
          <div className='grid grid-cols-2 gap-4 mx-auto'>

            {
              AddDoctorLable.lables.map((label, index) => {
                return (
                  <div className='flex flex-col mx-auto' key={index}>
                    <label>{label}</label>
                    <input
                      type={AddDoctorLable.type[index]}
                      placeholder={AddDoctorLable.placeholder[index]}
                      required className='border border-gray-200 px-2 py-1 rounded-md w-[400px]'
                    />
                  </div>
                );
              })
            }

          </div>
            <button type='submit' className='bg-(--color-primary) px-4 py-2 rounded-md text-(--color-white) '>Submit</button>

        </form>
      </section>
    </>
  )
}

export default AddDoctor;