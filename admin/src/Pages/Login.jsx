import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import { AdminContext } from '../context/AdminContext';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';



function Login() {

  const [state, setState] = useState("Admin");

  const { setAToken, BackendUrl } = useContext(AdminContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
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
          toast.success("successfully login")
        } else {
          toast.error(data.message);
        }
      }

    } catch (error) {
      console.log(error);
    }


  }

  return (
    <>
      <section className='flex flex-col items-center justify-center h-[80vh]'>


        <form action="" className='flex flex-col w-[90%] md:w-[70%] sm:w-[80%] lg:w-[35%] border-2 border-gray-200 p-8 rounded-lg my-auto shadow-md' onSubmit={onSubmitHandler}>
          <div className='w-full mx-auto flex justify-center'>
            <p><span className='text-(--color-primary) font-semibold mr-1'>{state}</span> Login</p>
          </div>
          <label htmlFor="EmailID">EmailID</label>
          <input type="text" placeholder='Enter Email ID' className='input bg-gray-300 px-4 py-2 rounded-md' onChange={(e) => setEmail(e.target.value)} value={email} />

          <label htmlFor="Password" className='mt-5'>Password</label>
          <input type="text" placeholder='Enter Passoword' className='input bg-gray-300 px-4 py-2 rounded-md ' onChange={(e) => setPassword(e.target.value)} value={password} />
          <button className={`flex py-2 bg-(--color-primary) w-[50%] items-center justify-center rounded-md text-(--color-white) mt-6 mx-auto hover:scale-105 transition ease-in-out duration-200 cursor-pointer hover:shadow-[0_4px_10px_var(--color-primary)] `} type='submit'>Login</button>

          {
            state === "Admin" ?
              <p className='text-(--color-text1) font-light text-[14px] mt-5'>Doctor Login? <span className='text-(--color-primary) cursor-pointer' onClick={() => setState("Doctor")}>Click Here</span></p> :
              <p className='text-(--color-text1) font-light text-[14px] mt-5'>Admin Login? <span className='text-(--color-primary) cursor-pointer' onClick={() => setState("Admin")}>Click Here</span></p>
          }
        </form>
      </section>
    </>
  )
}

export default Login