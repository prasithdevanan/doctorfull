import React from 'react'
import { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";




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
      <section className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-400/40 via-cyan-400/10 to-teal-400/40">

        <form
          className="flex flex-col w-[90%] sm:w-[80%] md:w-[70%] lg:w-[35%] border border-gray-200 p-8 rounded-xl shadow-md bg-white/30 backdrop-blur-2xl"
          onSubmit={onSubmitHandler} autoComplete='on'
        >
          <div className="w-full flex justify-center mb-4">
            <p className="text-lg font-medium">
              <span className="text-(--color-primary) font-semibold mr-1">{state}</span> Login
            </p>
          </div>

          <label className="text-sm text-gray-600">Email ID</label>
          <input type="email" placeholder="Enter Email ID" className="mt-1 px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-(--color-primary)" onChange={(e) => setEmail(e.target.value)}
            value={email} autoComplete='email'
          />

          <label className="mt-5 text-sm text-gray-600">Password</label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 rounded-md bg-gray-100/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            />

            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 cursor-pointer"
            >
              {passwordVisible ? "Hide" : "Show"}
            </span>
          </div>

          <button
            className="flex py-2 bg-(--color-primary) w-[50%] cursor-pointer items-center justify-center rounded-md text-white mt-6 mx-auto hover:scale-105 transition duration-200 hover:shadow-lg"
            type="submit"
          >
            {load ? "Verifying..." : "Login"}
          </button>

          {state === "Admin" ? (
            <p className="text-gray-500 text-sm mt-5 text-center">
              Doctor Login?{" "}
              <span
                className="text-(--color-primary) cursor-pointer"
                onClick={() => setState("Doctor")}
              >
                Click Here
              </span>
            </p>
          ) : (
            <p className="text-gray-500 text-sm mt-5 text-center">
              Admin Login?{" "}
              <span
                className="text-(--color-primary) cursor-pointer"
                onClick={() => setState("Admin")}
              >
                Click Here
              </span>
            </p>
          )}
        </form>
      </section>
    </>
  )
}

export default Login