import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../component/CreateContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function signin() {
    const navigate = useNavigate();

    //context
    const  {BackendUrl}  = useContext(AppContext);

    //use states for the inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');

    const onsubmit = async (e) => {
        e.preventDefault();
        console.log(email, password, repassword);

        if (!email || !password || !repassword) {
            return (
                toast.error("Missing data")
            )
        } else if (password !== repassword) {
            return (
                toast.error("Password doesn't match")
            )
        } else if (password.length < 8) {
            return (
                toast.error("Enter strong password")
            )
        } else {
            await axios.post(BackendUrl + '/api/doctor/signin', { email, password }).then((res) => {
                toast.warning(res.data);
                if (res.data.success) {
                    toast.success(res.data.message);
                    navigate('/login');
                } else {
                    toast.error(res.data.message);
                }
            }).catch((err) => {
                console.log(err);
                toast.error(err.message);
            })
        }
    }


    return (
        <>
            <section className='flex items-center justify-center h-[80vh]'>
                <form action="" className='flex flex-col w-[90%] md:w-[70%] sm:w-[80%] lg:w-[35%] border-2 border-gray-200 px-4 pt-4 pb-2 rounded-lg my-auto' onSubmit={onsubmit}>
                    <p className='font-semibold mx-auto'>Signin</p>
                    <label htmlFor="EmailID">EmailID</label>
                    <input type="text" placeholder='Enter Email ID' className='input bg-gray-100 border border-gray-200 px-2 py-2 rounded-md ' onChange={(e) => setEmail(e.target.value)} value={email} required />
                    <label htmlFor="Password" className='mt-5'>Password</label>
                    <input type="text" placeholder='Enter Passoword' className='input bg-gray-100 border border-gray-200 px-2 py-2 rounded-md ' onChange={(e) => setPassword(e.target.value)} value={password} required />
                    <label htmlFor="Password" className='mt-5'>RE-Password</label>
                    <input type="text" placeholder='Re-Enter Passoword' className='input bg-gray-100 border border-gray-200 px-2 py-2 rounded-md ' onChange={(e) => setRePassword(e.target.value)} value={repassword} required />
                    <button className={`flex py-2 bg-(--color-primary) w-[50%] items-center justify-center rounded-md text-(--color-white) mt-6 mx-auto hover:scale-105 transition ease-in-out duration-200 cursor-pointer`} type='submit'>Signin</button>
                    <p className='text-gray-500 font-medium mx-auto mt-3'>Don't have an account? <span className='text-(--color-primary) underline cursor-pointer' onClick={() => navigate('/login')}>Login</span></p>
                </form>
            </section>
        </>
    )
}

export default signin