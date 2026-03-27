import React from 'react';
import { Images } from '../../Components/Images';

function DoctorList() {
  return (
    <>
    <section>
      <form action="">
        <p>Add Doctor</p>

        <div>
          <label htmlFor="doc_img">
          <img src={Images.AdminProfile} alt="img" />
          </label>

          <input type="file" id='doc_img' />
          <p>Upload Doctor Picture</p>
        </div>
      </form>
    </section>
    </>
  )
}

export default DoctorList