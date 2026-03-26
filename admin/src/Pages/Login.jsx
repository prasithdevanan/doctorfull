import React from 'react'
import { useState } from 'react'

function Login() {

  const [state, setState] = useState("Admin")

  const useFuntion = (e) => {
    e.preventDefault();
    console.log(e.target);
  }
  return (
    <>
      <section className='flex flex-col items-center justify-center h-[80vh]'>


        <form action="" className='flex flex-col w-[90%] md:w-[70%] sm:w-[80%] lg:w-[35%] border-2 border-gray-200 p-8 rounded-lg my-auto'>
          <div className='w-full mx-auto flex justify-center'>
            <p><span>{state}</span> Login</p>
          </div>
          <label htmlFor="EmailID">EmailID</label>
          <input type="text" placeholder='Enter Email ID' className='input bg-gray-300 px-2 py-2 rounded-md ' />
          <label htmlFor="Password" className='mt-5'>Password</label>
          <input type="text" placeholder='Enter Passoword' className='input bg-gray-300 px-2 py-2 rounded-md ' />
          <button className={`flex py-2 bg-(--color-primary) w-[50%] items-center justify-center rounded-md text-(--color-white) mt-6 mx-auto hover:scale-105 transition ease-in-out duration-200 cursor-pointer`} type='submit' onClick={useFuntion}>Login</button>
        </form>
      </section>
    </>
  )
}

export default Login