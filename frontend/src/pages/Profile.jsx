import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../component/CreateContext';
import { Icons } from '../assets/img';
import axios from 'axios';
import { toast } from 'react-toastify';

function Profile() {
  const { token, BackendUrl } = useContext(AppContext);

  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState('');
  const [load, setLoad] = useState(false);

  const [user, setUser] = useState({});
  console.log(user);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const feach = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/api/patient/signin/${userId}`);
        if (res.data.success) {
          return setUser(res.data.user);
        }
        toast.error(res.data.message);
      } catch (error) {
        console.log(error?.response?.data?.message || error.message);
      }
    };
    feach();
  }, []);

  ///user firtLetter capital

  const useName = user?.email?.split('@')[0] ?? "";
  const UserName = useName ? useName.charAt(0).toUpperCase() + useName.slice(1) : "";




  useEffect(() => {
    if (user?.email) {
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

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoad(false);
    }
  };
  return (
    <>
      <section className="w-full min-h-screen bg-[#f5f7fb] flex flex-col items-center px-4 py-10">

        <div className="w-full max-w-3xl text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome <span className="text-(--color-primary)">{UserName}</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Manage your personal profile and health details</p>
        </div>

        <div className="w-full max-w-3xl bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

          <div className="flex flex-col items-center gap-4 mb-8">

            <div className="relative">

              <img src={image instanceof File ? URL.createObjectURL(image) : image || user?.image || Icons.Profile} alt="profile" className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-100" />

              <label htmlFor="imageUpload" className="absolute bottom-2 right-2 bg-(--color-primary) text-white p-2 rounded-full cursor-pointer">
                <i className="bi bi-pencil-square text-sm"></i>
              </label>

              <input type="file" id="imageUpload" className="hidden" onChange={(e) => setImage(e.target.files[0])} />

            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <input type="text" value={"PAT ID: " + (user?.patientId ?? "")} readOnly disabled className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-600 border border-gray-100" />

            <input type="text" value={UserName} readOnly disabled className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-600 border border-gray-100" />

            <input type="email" value={user?.email ?? ""} readOnly disabled className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-600 border border-gray-100 sm:col-span-2" />

            <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" />

            <input type="date" value={dob ? dob : user?.DOB ?? ""} onChange={(e) => setDob(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" />

            <select value={gender ? gender : user?.gender ?? ""} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none sm:col-span-2">
              <option value="" hidden>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

          </div>

          <div className="mt-8 flex justify-center">

            <button onClick={updateProfile} className="bg-(--color-primary) hover:bg-(--color-primary)/90 cursor-pointer text-white px-8 py-3 rounded-2xl font-medium transition shadow-md">
              {load ? "Updating..." : "Update Profile"}
            </button>

          </div>

        </div>

      </section>
    </>
  )
}

export default Profile;