import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../component/CreateContext';
import { Icons } from '../assets/img';
import axios from 'axios';
import { toast } from 'react-toastify';

function Profile() {
  const { user, token, BackendUrl } = useContext(AppContext);
  const useName = user?.email.split('@')[0];
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState('');
  const [load, setLoad] = useState(false);

  ///user firtLetter capital
  const UserName = useName?.charAt(0).toUpperCase() + useName?.slice(1);


  useEffect(() => {
    if (user) {
      setPhone(user.phone ?? '');
      setDob(user.DOB ?? '');
      setGender(user.gender ?? '');
      setImage(user.image ?? '');
    }
  }, [user]);

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
    }
  }, [token]);


  //update profile function
  const updateProfile = async () => {
    setLoad(true);
    try {
      const formData = new FormData();
      formData.append('name', useName);
      formData.append('email', user?.email);
      formData.append('phone', phone);
      formData.append('DOB', dob);
      formData.append('gender', gender);
      formData.append('image', image);

      const res = await axios.put(`${BackendUrl}/api/patient/update/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (!res.data.success) {
        toast.error(res.data.message);
      }

      toast.success(res.data.message);
      console.log(res.data);
    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
    } finally {
      setLoad(false);
    }
  };
  return (
    <>
      <section className='w-screen h-[calc(100vh-120px)] items-center flex flex-col gap-5'>
        <h1>welcome <span className='font-semibold'>{UserName}</span></h1>
        <div className='flex items-end gap-2'>
          <img src={image instanceof File ? URL.createObjectURL(image) : image || user?.image || Icons.Profile} alt="profile" className="w-32 h-32 rounded-full border-2 border-gray-200"
          />
          <input type="file" className='hidden' id='imageUpload' onChange={(e) => setImage(e.target.files[0])} />
          <label htmlFor='imageUpload' className='bg-blue-500 text-white py-1 px-2 rounded-md cursor-pointer mt-2 inline-block h-fit'>
            <i className="bi bi-pencil-square"></i>
          </label>
        </div>
        <div className='grid grid-cols-2 gap-4 w-[90%] md:w-[70%] sm:w-[80%] lg:w-[50%] border-2 border-gray-200 px-4 pt-4 pb-2 rounded-lg bg-white/50 backdrop-blur-md'>
          <input type="text" placeholder='Full Name' value={useName} className='py-2 bg-(--color-input) px-3 rounded-md' />
          <input type="email" placeholder="Email Address" value={user?.email} readOnly className='py-2 bg-(--color-input) px-3 rounded-md' />
          <input type="tel" placeholder="Phone Number" className='py-2 bg-(--color-input) px-3 rounded-md' onChange={(e) => setPhone(e.target.value)} value={phone} maxLength={10}/>

          <input type="date" className='py-2 bg-(--color-input) px-3 rounded-md' onChange={(e) => setDob(e.target.value)} value={dob ? dob : user?.DOB ?? ''} />

          <select className='py-2 bg-(--color-input) px-3 rounded-md' value={gender ? gender : user?.gender ?? ''} onChange={(e) => setGender(e.target.value)}>

            <option value="" hidden>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <button className='bg-(--color-primary) py-2 px-3 text-(--color-white) rounded-md hover:shadow-md hover:shadow-blue-200 hover:scale-105 ease-in-out duration-300 cursor-pointer' onClick={updateProfile}>{load ? "Uploding....." : "Update Profile"}</button>
        </div>
      </section>
    </>
  )
}

export default Profile;