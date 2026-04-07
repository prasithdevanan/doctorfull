import React, { useContext, useEffect, useRef, useState } from 'react';
import { Images } from '../../Components/Images';
import { AddDoctorLable, speciality } from '../../assets/Data';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

function AddDoctor() {

  const [profile, setProfile] = useState(null);
  const [doctorName, setDoctorName] = useState();
  const [doctorEmail, setDoctorEmail] = useState();
  const [doctorPassword, setDoctorPassword] = useState('');
  const [doctorExperience, setDoctorExperience] = useState('');
  const [fees, setFees] = useState('');
  const [doctorSpeciality, setDoctorSpeciality] = useState('');
  const [education, setEducation] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [about, setAbout] = useState('');

  const { BackendUrl, aToken } = useContext(AdminContext);

  console.log(BackendUrl, aToken)


  useEffect(() => {
    console.log("Doctor Email changed:", doctorEmail);
  }, [doctorEmail]);

  useEffect(() => {
    console.log("Doctor Name changed:", doctorName);
    console.log("Doctor Name changed:", doctorExperience);
  }, [doctorName, doctorExperience]);

  const onSubmitHandle = async (e) => {
    e.preventDefault();

    try {
      //form Data
      const formData = new FormData();

      formData.append('name', doctorName);
      formData.append('email', doctorEmail);
      formData.append('profile', profile);
      formData.append('password', doctorPassword);
      formData.append('experience', doctorExperience);
      formData.append('fees', Number(fees));
      formData.append('speciality', doctorSpeciality);
      formData.append('address', JSON.stringify({ "address1": address1, "address2": address2 }));
      formData.append('about', about);
      formData.append('degree', education);

      formData.forEach((item, key) => {
        console.log(item, key)
      })

      const { data } = await axios.post(BackendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error) {
        toast.error(error)
      }

    }


    // console.log([profile, doctorEmail, doctorName, doctorSpeciality, fees, education, address1, address2, about])
  }

  return (
    <>
      <section className='bg-(--color-white) w-full h-[90vh] flex flex-col items-center'>

        <h2 className='mt-4'>Add Doctor</h2>


        <section className='w-[80%] flex-1 overflow-y-auto overflow-x-hidden'>
          <div className='p-4 w-fit'>
            <label htmlFor="img_doc" className='flex items-center gap-2'>
              <img src={profile ? URL.createObjectURL(profile) : Images.AdminProfile} alt="img" className='w-[60px]' />
              <input type="file" name="Profile" id="img_doc" hidden className='border bg-gray-200 py-2 pl-4 rounded-md border-gray-400' onChange={(e) => setProfile(e.target.files[0])} />
              <span className='text-blue-600 underline underline-offset-1'>Upload Profile</span>
            </label>
          </div>
          <form action="" onSubmit={onSubmitHandle}>
            <section className='grid grid-cols-2 gap-4'>

              <div className='flex flex-col'>
                <label htmlFor="">Doctor name</label>
                <input type="text" placeholder='Enter Doctor Name' className='border bg-gray-200 py-2 pl-4 rounded-md border-gray-400' onChange={(e) => setDoctorName(e.target.value)} value={doctorName} />
              </div>

              <div className='flex flex-col'>
                <label htmlFor="">Doctor Email</label>
                <input type="text" placeholder='Enter Doctor Email' className='border bg-gray-200 py-2 pl-4 rounded-md border-gray-400' onChange={(e) => setDoctorEmail(e.target.value)} value={doctorEmail} />
              </div>

              <div className='flex flex-col'>
                <label htmlFor="">Doctor Password</label>
                <input type="text" placeholder='Enter Doctor Password' className='border bg-gray-200 py-2 pl-4 rounded-md border-gray-400' onChange={(e) => setDoctorPassword(e.target.value)} value={doctorPassword} />
              </div>

              <div className='flex flex-col'>
                <label htmlFor="">Doctor Experience</label>
                <select name="" id="" className='border bg-gray-200 py-2 pl-4 rounded-md border-gray-400' onChange={(e) => setDoctorExperience(e.target.value)} value={doctorExperience}>
                  <option value="1 Years">1 Years</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                  <option value="4 Years">4 Years</option>
                  <option value="5 Years">5 Years</option>
                  <option value="6 Years">6 Years</option>
                  <option value="7 Years">7 Years</option>
                  <option value="8 Years">8 Years</option>
                  <option value="9 Years">9 Years</option>
                  <option value="10 Years">10 Years</option>
                </select>
              </div>
              <div className='flex flex-col'>
                <label htmlFor="">Fees</label>
                <input type="text" placeholder='Your fees' className='border bg-gray-200 py-2 pl-4 rounded-md border-gray-400' onChange={(e) => setFees(e.target.value)} />
              </div>
              <div className='flex flex-col'>
                <label htmlFor="">Speciality</label>
                <select name="" id="" className='border bg-gray-200 py-2 pl-4 rounded-md border-gray-400' onChange={(e) => setDoctorSpeciality(e.target.value)}>
                  {
                    speciality.map((items, index) => {
                      return (
                        <option value={items.name} key={index}>{items.name}</option>
                      )
                    })
                  }
                </select>
              </div>
              <div className='flex flex-col'>
                <label htmlFor="">Education</label>
                <input type="text" placeholder='Education' className='border bg-gray-200 py-2 pl-4 rounded-md border-gray-400' onChange={(e) => setEducation(e.target.value)} />
              </div>
              <div className='flex flex-col'>
                <label htmlFor="">Address</label>
                <input type="text" placeholder='Addesss 1' className='border bg-gray-200 py-2 pl-4 rounded-md border-gray-400 mb-2' onChange={(e) => setAddress1(e.target.value)} />
                <input type="text" placeholder='Addesss 2' className='border bg-gray-200 py-2 pl-4 rounded-md border-gray-400' onChange={(e) => setAddress2(e.target.value)} />
              </div>
            </section>
            <div className='flex flex-col'>
              <label htmlFor="">About</label>
              <textarea name="" id="" placeholder='write about yourself' className='border bg-gray-200 py-2 pl-4 rounded-md border-gray-400 w-[50%]' onChange={(e) => setAbout(e.target.value)} />
            </div>

            <div className='flex w-full justify-center mt-4'>
              <button className='bg-(--color-primary) py-2 px-6 text-(--color-white) rounded-md cursor-pointer hover:box-shadow mb-6' type='submit'>Add Doctor</button>
            </div>
          </form>
        </section>
      </section>
    </>
  )
}

export default AddDoctor;