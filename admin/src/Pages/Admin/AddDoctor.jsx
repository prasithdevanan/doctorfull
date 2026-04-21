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

    } catch (error) {
      toast.error(error);
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="bg-(--color-white) w-full h-[85vh] flex flex-col items-center px-4 sm:px-6">

        <h2 className="mt-4 text-lg font-semibold">
          Add Doctor
        </h2>

        <section className="w-full sm:w-[85%] lg:w-[80%] flex-1 overflow-y-auto overflow-x-hidden mt-4">


          <div className="p-4 w-fit">
            <label htmlFor="img_doc" className="flex items-center gap-3 cursor-pointer">

              <img
                src={profile ? URL.createObjectURL(profile) : Images.Profile}
                alt="img"
                className="w-12 h-12 rounded-full object-cover"
              />

              <input
                type="file"
                id="img_doc"
                hidden
                onChange={(e) => setProfile(e.target.files[0])}
              />

              <span className="text-(--color-primary) underline underline-offset-2">
                Upload Profile
              </span>

            </label>
          </div>

          <form onSubmit={onSubmitHandle} className="space-y-4">

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">

              <div className="flex flex-col gap-1">
                <label>Doctor name</label>
                <input
                  type="text"
                  placeholder="Enter Doctor Name"
                  className="border bg-(--color-input) py-2 px-3 rounded-md border-gray-200 outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => setDoctorName(e.target.value)}
                  value={doctorName}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label>Doctor Email</label>
                <input
                  type="text"
                  placeholder="Enter Doctor Email"
                  className="border bg-(--color-input) py-2 px-3 rounded-md border-gray-200 outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => setDoctorEmail(e.target.value)}
                  value={doctorEmail ? doctorEmail : ''}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label>Doctor Password</label>
                <div className='relative'>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter Doctor Password"
                    className="border bg-(--color-input) py-2 w-full px-3 rounded-md border-gray-200 outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setDoctorPassword(e.target.value)}
                    value={doctorPassword}
                  />
                  <span className='absolute text-gray-500 right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:text-gray-600 text-sm' onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? "Show" : "Hide"}</span>
                </div>

              </div>

              <div className="flex flex-col gap-1">
                <label>Doctor Experience</label>
                <select
                  className="border bg-gray-100 py-2 px-3 rounded-md border-gray-200"
                  onChange={(e) => setDoctorExperience(e.target.value)}
                  value={doctorExperience}
                >
                  <option value="" disabled>Select Experience</option>
                  {[...Array(11)].map((_, i) => (
                    <option key={i} value={`${i + 1} Years`}>
                      {i + 1} Years
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label>Fees</label>
                <input
                  type="text"
                  placeholder="Your fees"
                  className="border bg-(--color-input) py-2 px-3 rounded-md border-gray-200"
                  onChange={(e) => setFees(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label>Speciality</label>
                <select
                  className="border bg-(--color-input) py-2 px-3 rounded-md border-gray-200"
                  onChange={(e) => setDoctorSpeciality(e.target.value)}
                >
                  <option value="" disabled>Select Speciality</option>
                  {speciality.map((items, index) => (
                    <option key={index} value={items.name}>
                      {items.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label>Education</label>
                <input
                  type="text"
                  placeholder="Education"
                  className="border bg-(--color-input) py-2 px-3 rounded-md border-gray-200"
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="Address 1"
                  className="border bg-(--color-input) py-2 px-3 rounded-md border-gray-200 mb-2"
                  onChange={(e) => setAddress1(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Address 2"
                  className="border bg-(--color-input) py-2 px-3 rounded-md border-gray-200"
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>

            </section>


            <div className="flex flex-col gap-1 px-4">
              <label>About</label>
              <textarea
                placeholder="Write about yourself"
                className="border bg-(--color-input) py-2 px-3 rounded-md border-gray-200 w-full h-28 resize-none"
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-(--color-primary) py-2 px-6 text-(--color-white) rounded-md hover:opacity-90 transition"
              >
                {loading ? "Uploading..." : "Add Doctor"}
              </button>
            </div>

          </form>

        </section>
      </section>
    </>
  )
}

export default AddDoctor;