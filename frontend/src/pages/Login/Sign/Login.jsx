import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../../component/CreateContext';
import { Images } from '../../../assets/img';

function Login() {
    const { BackendUrl, setToken, user, setUser } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState("Login");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');;


    const useFuntion = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return toast.error("Missing data")
        }
        await axios.post(BackendUrl + '/api/patient/login', { email, password }).then((res) => {
            toast.warning(res.data);
            if (res.data.success) {
                toast.success(res.data.message);
                localStorage.setItem('userId', res.data.user.id);
                setToken(true);
                navigate('/doctor');
                setUser(res.data.user);
                return;
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.log(err);
            toast.error(err.response?.data?.message || "Login failed");
        })
    }
    return (
        <>
            <section className='flex items-center justify-center h-[100vh] relative'>
                <img src={Images.LoginBg} alt="Login Background" className='absolute inset-0 object-cover w-full h-full z-[-1] ' />
                <form action="" className='flex flex-col w-[90%] md:w-[70%] sm:w-[80%] lg:w-[35%] border-2 border-gray-200 px-4 pt-4 pb-2 rounded-lg my-auto  bg-white/50 backdrop-blur-md' onSubmit={useFuntion}>
                    <p className='font-semibold mx-auto'>{status}</p>
                    <label htmlFor="EmailID">EmailID</label>
                    <input type="text" placeholder='Enter Email ID' className='input bg-gray-100/70 border border-gray-200 px-3 py-2 rounded-md' onChange={(e) => setEmail(e.target.value)} value={email} required />
                    <label htmlFor="Password" className='mt-5'>Password</label>
                    <input type="text" placeholder='Enter Passoword' className='input bg-gray-100/70 border border-gray-200 px-3 py-2 rounded-md' onChange={(e) => setPassword(e.target.value)} value={password} required />
                    <button
                        className={`flex py-2 bg-(--color-primary) w-[50%] items-center justify-center rounded-md text-(--color-white) mt-6 mx-auto hover:scale-105 transition ease-in-out duration-200 cursor-pointer`} type='submit'>
                        Login
                    </button>
                    <p className='text-gray-500 font-medium mx-auto mt-3'>Don't have an account? <span className='text-(--color-primary) underline cursor-pointer' onClick={() => navigate('/signin')}>Signin</span></p>
                </form>
            </section>
        </>
    )
}

export default Login