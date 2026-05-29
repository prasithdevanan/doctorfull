import React from 'react'
import { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Sidebar from './Sidebar';




function Login() {
  const navigate = useNavigate();
  const [state, setState] = useState("Admin");
  const [load, setLoad] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { setAToken, BackendUrl, setDToken } = useContext(AdminContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    setLoad(true);
    event.preventDefault();
    console.log("work")
    try {
      if (!email) {
        toast.error("Email is required");
        return;
      }

      if (!password) {
        toast.error("Password is required");
        return;
      }

      if (state === "Admin") {
        const { data } = await axios.post(BackendUrl + '/api/admin/login', { email, password });
        console.log(data);
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("successfully login");
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else if (state === "Doctor") {
        const { data } = await axios.post(BackendUrl + '/api/doctor/doctor/login', { email, password });
        console.log(data);

        if (!data.success) {
          toast.error(data.message);
          console.log(data.message);
        }
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          localStorage.setItem('dEmail', data?.doctor?.email);
          localStorage.setItem('id', data?.doctor?._id);
          setDToken(data.token);
          navigate('/');
          toast.success("successfully login");
        }
      }

    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setLoad(false);
    }


  }

  return (
    <>
      <section className="relative flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100">

        {/* Sidebar */}
        <div className="hidden lg:block top-0 left-0 w-1/2 h-screen p-4 max-w-[820px]">
          <Sidebar />
        </div>

        {/* Form Section */}
        <div className="ml-auto flex w-full lg:w-(calc(100%-820px)) min-h-screen items-center justify-center px-5 py-10 sm:px-8 md:px-14">

          {/* Form */}
          <form
            onSubmit={onSubmitHandler}
            autoComplete="on"
            className="relative z-10 w-full max-w-[480px] rounded-[32px] bg-white/75 p-7 sm:p-10 backdrop-blur-2xl border border-gray-300"
          >

            {/* Heading */}
            <div className="mb-8 text-center">

              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                Welcome Back
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-slate-800">
                <span className="bg-linear-(--color-primary-gradient) bg-clip-text text-transparent">
                  {state}
                </span>{" "}
                Login
              </h1>

            </div>

            {/* Email */}
            <div className="mb-5">

              <label className="mb-2 block text-sm font-medium text-slate-600">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/10"
              />

            </div>

            {/* Password */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-600">
                Password
              </label>

              <div className="relative">

                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-16 text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/10"
                />

                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-sm font-medium text-(--color-primary) transition hover:text-(--color-primary)/90"
                >
                  {passwordVisible ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* Button */}
            <button
              type="submit"
              className="cursor-pointer mt-8 flex w-full items-center justify-center rounded-2xl bg-(--color-primary) py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/50"
            >
              {load ? "Verifying..." : "Login"}
            </button>

            {/* Switch */}
            <div className="mt-7 text-center text-sm text-slate-500">

              {state === "Admin" ? (
                <p>
                  Doctor Login?{" "}
                  <span
                    onClick={() => setState("Doctor")}
                    className="cursor-pointer font-semibold text-(--color-primary) transition hover:text-(--color-primary)/90"
                  >
                    Click Here
                  </span>
                </p>
              ) : (
                <p>
                  Admin Login?{" "}
                  <span
                    onClick={() => setState("Admin")}
                    className="cursor-pointer font-semibold text-(--color-primary) transition hover:text-(--color-primary)/90"
                  >
                    Click Here
                  </span>
                </p>
              )}

            </div>

          </form>
        </div>
      </section>
    </>
  )
}

export default Login