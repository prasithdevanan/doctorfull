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
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="w-full h-[calc(100vh-60px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex justify-center px-4 py-6 overflow-y-auto">

        <div className="w-full max-w-4xl">

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add Doctor
          </h2>

          {/* Main Container */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 space-y-6">

            {/* ===== PROFILE ===== */}
            <div className="flex items-center gap-5 pb-4 border-b border-gray-100">
              <label htmlFor="img_doc" className="relative cursor-pointer group">

                <img
                  src={profile ? URL.createObjectURL(profile) : Images.Profile}
                  className="w-20 h-20 rounded-full object-cover border shadow-sm"
                />

                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition">
                  Upload
                </div>

                <input
                  type="file"
                  id="img_doc"
                  hidden
                  onChange={(e) => setProfile(e.target.files[0])}
                />
              </label>

              <div>
                <p className="text-sm text-gray-500">Profile Photo</p>
                <p className="text-xs text-gray-400">Click to upload image</p>
              </div>
            </div>

            {/* ===== FORM ===== */}
            <form onSubmit={onSubmitHandle} className="space-y-6">

              {/* Section 1 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Basic Information
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">

                  <input
                    type="text"
                    placeholder="Doctor Name"
                    className="input-soft"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Email Address"
                    className="input-soft"
                    value={doctorEmail || ""}
                    onChange={(e) => setDoctorEmail(e.target.value)}
                  />

                  {/* Password */}
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Password"
                      className="input-soft pr-14"
                      value={doctorPassword}
                      onChange={(e) => setDoctorPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 cursor-pointer"
                    >
                      {passwordVisible ? "Hide" : "Show"}
                    </span>
                  </div>

                  <select
                    className="input-soft"
                    value={doctorExperience}
                    onChange={(e) => setDoctorExperience(e.target.value)}
                  >
                    <option value="">Experience</option>
                    {[...Array(11)].map((_, i) => (
                      <option key={i}>{i + 1} Years</option>
                    ))}
                  </select>

                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Professional Details
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">

                  <input
                    type="text"
                    placeholder="Fees"
                    className="input-soft"
                    onChange={(e) => setFees(e.target.value)}
                  />

                  <select
                    className="input-soft"
                    onChange={(e) => setDoctorSpeciality(e.target.value)}
                  >
                    <option value="">Speciality</option>
                    {speciality.map((items, index) => (
                      <option key={index}>{items.name}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Education"
                    className="input-soft"
                    onChange={(e) => setEducation(e.target.value)}
                  />

                  <div>
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      className="input-soft mb-2"
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2"
                      className="input-soft"
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                </div>
              </div>

              {/* About */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  About
                </h3>

                <textarea
                  placeholder="Write something about doctor..."
                  className="input-soft h-28 resize-none"
                  onChange={(e) => setAbout(e.target.value)}
                />
              </div>

              {/* Button */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium shadow hover:scale-[1.02] transition"
                >
                  {loading ? "Uploading..." : "Add Doctor"}
                </button>
              </div>

            </form>

          </div>
        </div>
      </section>
    </>
  )
}

export default AddDoctor;