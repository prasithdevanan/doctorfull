import React from 'react';
import { Images } from '../../Components/Images';

function AddDoctor() {
  return (
    <>
        <section>
          <form action="">
            <p>Add Doctor</p>
    
            <div>
              <label htmlFor="doc_img">
              <img src={Images.AdminProfile} alt="img" />
              </label>
    
              <input type="file" className='bg-amber-300' id='doc_img'/>
              <p htmlFor='doc_img'>Upload Doctor Picture</p>
            </div>

            <div>
              <label htmlFor="">Name</label>
              <input type="Name" placeholder='Enter Name' required/>
            </div>
            <div>
              <label htmlFor="">Doctor Email</label>
              <input type="Name" placeholder='Enter Doctor Email' required/>
            </div>
            <div>
              <label htmlFor="">Doctor Password</label>
              <input type="Name" placeholder='Enter Password' required/>
            </div>
          </form>
        </section>
        </>
  )
}

export default AddDoctor