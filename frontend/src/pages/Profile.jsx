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
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const feach = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BackendUrl}/api/patient/signin/${userId}`);
        if (res.data.success) {
          return setUser(res.data.user);
        }
        toast.error(res.data.message);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
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

      {loading ?
        (
          <div className="flex flex-col justify-center items-center h-[calc(100vh-72px)]">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-(--color-primary) rounded-full animate-spin"></div>
            <p className='mt-2 ml-2'>Loading...</p>
          </div>
        ) :
        (
          <section className="w-full h-[calc(100vh-81px)] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-4 sm:py-6 flex flex-col justify-center">

            {/* Header */}
            <div className="w-full max-w-3xl mx-auto text-center mb-4 sm:mb-5 shrink-0">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--color-primary)/10 text-(--color-primary) text-xs font-semibold mb-2">
                <i className="bi bi-person-circle"></i>
                My Profile
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
                Welcome{' '}
                <span className="text-(--color-primary)">
                  {UserName}
                </span>
              </h1>

              <p className="text-slate-500 mt-1 text-xs sm:text-sm">
                Manage your personal profile and health details
              </p>

            </div>


            {/* Profile Card */}
            <div className="w-full max-w-3xl mx-auto min-h-0">

              <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-[0_15px_50px_rgba(15,23,42,0.07)] px-4 py-4 sm:px-6 sm:py-5">

                {/* Profile Image */}
                <div className="flex flex-col items-center mb-4">

                  <div className="relative">

                    <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-(--color-primary) to-cyan-400 blur-[2px] opacity-80"></div>

                    <img
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image || user?.image || Icons.Profile
                      }
                      alt="profile"
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg bg-slate-100"
                    />

                    <label
                      htmlFor="imageUpload"
                      className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 rounded-full bg-(--color-primary) text-white border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-all"
                    >
                      <i className="bi bi-camera-fill text-xs"></i>
                    </label>

                    <input
                      type="file"
                      id="imageUpload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />

                  </div>

                </div>


                {/* Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* Patient ID */}
                  <div className="relative">
                    <i className="bi bi-person-vcard absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>

                    <input
                      type="text"
                      value={"PAT ID: " + (user?.patientId ?? "")}
                      readOnly
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>


                  {/* Name */}
                  <div className="relative">
                    <i className="bi bi-person absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>

                    <input
                      type="text"
                      value={UserName}
                      readOnly
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>


                  {/* Email */}
                  <div className="relative sm:col-span-2">
                    <i className="bi bi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>

                    <input
                      type="email"
                      value={user?.email ?? ""}
                      readOnly
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>


                  {/* Phone */}
                  <div className="relative">
                    <i className="bi bi-telephone absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>

                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={10}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm outline-none focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/10 transition"
                    />
                  </div>


                  {/* DOB */}
                  <div className="relative">
                    <i className="bi bi-calendar3 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>

                    <input
                      type="date"
                      value={dob ? dob : user?.DOB ?? ""}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm outline-none focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/10 transition"
                    />
                  </div>


                  {/* Gender */}
                  <div className="relative sm:col-span-2">
                    <i className="bi bi-gender-ambiguous absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>

                    <select
                      value={gender ? gender : user?.gender ?? ""}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-sm outline-none appearance-none focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/10 transition cursor-pointer"
                    >
                      <option value="" hidden>
                        Select Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>

                    <i className="bi bi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                  </div>

                </div>


                {/* Button */}
                <div className="mt-4 flex justify-center">

                  <button
                    onClick={updateProfile}
                    disabled={load}
                    className="inline-flex items-center justify-center gap-2 min-w-40 px-7 py-2.5 rounded-xl bg-(--color-primary) hover:bg-(--color-primary)/90 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                  >

                    {load ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle"></i>
                        Update Profile
                      </>
                    )}

                  </button>

                </div>

              </div>

            </div>

          </section>
        )}
    </>
  )
}

export default Profile;