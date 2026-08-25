import React, { useContext, useEffect, useRef, useState } from 'react';
import { Images } from '../../Components/Images';
import { AddDoctorLable, speciality } from '../../assets/Data';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

function AddDoctor() {

  const [loading, setLoading] = useState(false);
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
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { BackendUrl, aToken } = useContext(AdminContext);


  const onSubmitHandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!doctorName || !doctorEmail || !profile || !doctorPassword || !doctorExperience || !fees || !doctorSpeciality || !education || !address1 || !address2 || !about) {
      toast.error("Missing data");
      setLoading(false);
      return;
    }
    try {
      //form Data
      const formData = new FormData();

      formData.append('name', doctorName);
      formData.append('email', doctorEmail);
      formData.append('image', profile);
      formData.append('password', doctorPassword);
      formData.append('experience', doctorExperience);
      formData.append('fees', Number(fees));
      formData.append('speciality', doctorSpeciality);
      formData.append('address', JSON.stringify({ "address1": address1, "address2": address2 }));
      formData.append('about', about);
      formData.append('degree', education);

      const { data } = await axios.post(BackendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })

      if (data.success) {
        toast.success(data.message);
        e.target.reset();
        setProfile(null);
        setDoctorName('');
        setDoctorEmail('');
        setDoctorPassword('');
        setDoctorExperience('');
        setFees('');
        setDoctorSpeciality('');
        setEducation('');
        setAddress1('');
        setAddress2('');
        setAbout('');
      } else {
        toast.error(data.message);
      }
      toast.error("Dublicate email");

    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="h-[calc(100vh-60px)] w-full overflow-y-auto bg-slate-50">

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ================= PAGE HEADER ================= */}
        <div className="mb-6">

          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600" />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Doctor Management
            </span>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Add Doctor
              </h1>

              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Create a new doctor profile and add their professional information
              </p>
            </div>

          </div>
        </div>


        {/* ================= MAIN CARD ================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* ================= PROFILE HEADER ================= */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-5 py-6 sm:px-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              {/* PROFILE IMAGE */}
              <label
                htmlFor="img_doc"
                className="group relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-4 border-white/90 bg-white/10 shadow-lg"
              >

                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : Images.Profile
                  }
                  alt="Doctor profile"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">

                  <i className="bi bi-camera text-lg" />

                  <span className="mt-1 text-[9px] font-semibold">
                    Change Photo
                  </span>

                </div>

                <input
                  type="file"
                  id="img_doc"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (!file) return;

                    const img = new Image();
                    const url = URL.createObjectURL(file);

                    img.onload = () => {
                      if (img.width === img.height) {
                        setProfile(file);
                      } else {
                        alert("Please select a square image");
                        setProfile(null);
                      }

                      URL.revokeObjectURL(url);
                    };

                    img.src = url;
                  }}
                />

              </label>


              {/* PROFILE TEXT */}
              <div className="min-w-0 text-white">

                <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200">
                  Doctor Profile
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  Profile Photo
                </h2>

                <p className="mt-1 max-w-md text-xs leading-5 text-blue-100/70">
                  Upload a professional square image. This photo will be displayed
                  on the doctor's profile.
                </p>

              </div>

            </div>

          </div>


          {/* ================= FORM ================= */}
          <form
            onSubmit={onSubmitHandle}
            className="space-y-0"
            autoComplete="off"
          >

            {/* ================= BASIC INFORMATION ================= */}
            <div className="px-5 py-6 sm:px-7">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <i className="bi bi-person text-sm" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Basic Information
                  </h3>

                  <p className="text-[11px] text-slate-400">
                    Personal and account information
                  </p>
                </div>

              </div>


              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* NAME */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Doctor Name
                  </label>

                  <div className="relative">
                    <i className="bi bi-person absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300" />

                    <input
                      type="text"
                      placeholder="Enter doctor's name"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>


                {/* EMAIL */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Email Address
                  </label>

                  <div className="relative">
                    <i className="bi bi-envelope absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300" />

                    <input
                      type="text"
                      name="random-email-field"
                      autoComplete="new-email"
                      placeholder="doctor@example.com"
                      value={doctorEmail || ""}
                      onChange={(e) => setDoctorEmail(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>


                {/* PASSWORD */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Password
                  </label>

                  <div className="relative">

                    <i className="bi bi-lock absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300" />

                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="random-password-field"
                      autoComplete="new-password"
                      placeholder="Create password"
                      value={doctorPassword}
                      onChange={(e) => setDoctorPassword(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-16 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    />

                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[10px] font-semibold text-blue-600"
                    >
                      {passwordVisible ? "Hide" : "Show"}
                    </button>

                  </div>
                </div>


                {/* EXPERIENCE */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Experience
                  </label>

                  <div className="relative">

                    <i className="bi bi-briefcase absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300" />

                    <select
                      value={doctorExperience}
                      onChange={(e) => setDoctorExperience(e.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    >
                      <option value="">Select experience</option>

                      {[...Array(11)].map((_, i) => (
                        <option key={i}>
                          {i + 1} Years
                        </option>
                      ))}

                    </select>

                    <i className="bi bi-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300" />

                  </div>
                </div>

              </div>

            </div>


            {/* ================= PROFESSIONAL INFORMATION ================= */}
            <div className="border-t border-slate-100 px-5 py-6 sm:px-7">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <i className="bi bi-hospital text-sm" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Professional Information
                  </h3>

                  <p className="text-[11px] text-slate-400">
                    Speciality, education and consultation details
                  </p>
                </div>

              </div>


              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* FEES */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Consultation Fee
                  </label>

                  <div className="relative">

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      ₹
                    </span>

                    <input
                      type="text"
                      placeholder="Enter consultation fee"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                      onChange={(e) => setFees(e.target.value)}
                    />

                  </div>
                </div>


                {/* SPECIALITY */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Speciality
                  </label>

                  <select
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    onChange={(e) => setDoctorSpeciality(e.target.value)}
                  >
                    <option value="">Select speciality</option>

                    {speciality.map((items, index) => (
                      <option key={index}>
                        {items.name}
                      </option>
                    ))}

                  </select>
                </div>


                {/* EDUCATION */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Education
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. MBBS, MD"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    onChange={(e) => setEducation(e.target.value)}
                  />
                </div>

              </div>

            </div>


            {/* ================= ADDRESS ================= */}
            <div className="border-t border-slate-100 px-5 py-6 sm:px-7">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <i className="bi bi-geo-alt text-sm" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Clinic Address
                  </h3>

                  <p className="text-[11px] text-slate-400">
                    Add the doctor's clinic or practice location
                  </p>
                </div>

              </div>


              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Address Line 1
                  </label>

                  <input
                    type="text"
                    placeholder="Street address"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    onChange={(e) => setAddress1(e.target.value)}
                  />
                </div>


                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Address Line 2
                  </label>

                  <input
                    type="text"
                    placeholder="Apartment, suite, area..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                </div>

              </div>

            </div>


            {/* ================= ABOUT ================= */}
            <div className="border-t border-slate-100 px-5 py-6 sm:px-7">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <i className="bi bi-card-text text-sm" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    About Doctor
                  </h3>

                  <p className="text-[11px] text-slate-400">
                    Add a short professional description
                  </p>
                </div>

              </div>


              <textarea
                placeholder="Write a short description about the doctor's experience, expertise and practice..."
                className="min-h-28 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs leading-5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                onChange={(e) => setAbout(e.target.value)}
              />

            </div>


            {/* ================= ACTION BAR ================= */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">

              <p className="text-[10px] text-slate-400">
                Please review the information before creating the doctor account.
              </p>

              <div className="flex items-center justify-end gap-3">

                <button
                  type="button"
                  className="h-10 cursor-pointer rounded-xl border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-10 min-w-32 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus" />
                      Add Doctor
                    </>
                  )}

                </button>

              </div>

            </div>

          </form>

        </div>

      </div>

    </section>
  )
}

export default AddDoctor;