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
      <section className="w-screen min-h-[calc(100vh-120px)] flex flex-col items-center justify-center gap-6 px-4">

        <h1 className="text-xl md:text-2xl text-gray-700">
          Welcome <span className="font-semibold text-gray-900">{UserName}</span>
        </h1>

        <div className="flex items-end gap-3">
          <img
            src={image instanceof File ? URL.createObjectURL(image) : image || user?.image || Icons.Profile}
            alt="profile"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-gray-200 object-cover"
          />

          <input
            type="file"
            className="hidden"
            id="imageUpload"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <label
            htmlFor="imageUpload"
            className="bg-(--color-primary) text-white p-2 rounded-full cursor-pointer hover:opacity-90 transition"
          >
            <i className="bi bi-pencil-square text-sm"></i>
          </label>
        </div>

        {/* Form */}
        <div className="flex flex-col sm:grid grid-cols-2 gap-4 w-full max-w-2xl border border-gray-200 p-4 rounded-xl bg-white/70 backdrop-blur-md shadow-sm">
          <input type="text" value={"PAT ID :"+ user?.patientId ?? ""}
            readOnly
            disabled
            className="py-2 px-3 rounded-md bg-(--color-input) text-gray-600 col-span-2" />


          <input
            type="text"
            placeholder="Full Name"
            value={UserName}
            readOnly
            disabled
            className="py-2 px-3 rounded-md bg-(--color-input) text-gray-600"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={user?.email ?? ""}
            readOnly
            disabled
            className="py-2 px-3 rounded-md bg-(--color-input) text-gray-600"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={10}
            className="py-2 px-3 rounded-md bg-(--color-input) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
          />

          <input
            type="date"
            value={dob ? dob : user?.DOB ?? ""}
            onChange={(e) => setDob(e.target.value)}
            className="py-2 px-3 rounded-md bg-(--color-input) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
          />

          <select
            value={gender ? gender : user?.gender ?? ""}
            onChange={(e) => setGender(e.target.value)}
            className="py-2 px-3 rounded-md bg-(--color-input) focus:outline-none focus:ring-2 focus:ring-(--color-primary) col-span-1 sm:col-span-2"
          >
            <option value="" hidden>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

        </div>

        {/* Button */}
        <div>
          <button
            onClick={updateProfile}
            className="bg-(--color-primary) text-white py-2 px-4 rounded-md hover:shadow-md hover:scale-105 transition duration-300 cursor-pointer"
          >
            {load ? "Uploading..." : "Update Profile"}
          </button>
        </div>

      </section>
    </>
  )
}

export default Profile;