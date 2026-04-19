import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../component/CreateContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Images } from '../../../assets/img';

function signin() {
    const navigate = useNavigate();

    //context
    const { BackendUrl } = useContext(AppContext);

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
            await axios.post(BackendUrl + '/api/patient/signin', { email, password }).then((res) => {
                toast.warning(res.data);
                if (res.data.success) {
                    toast.success(res.data.message);
                    navigate('/login');
                } else {
                    toast.error(res.data.message);
                }
            }).catch((err) => {
                console.log(err);
                toast.error(err.response?.data?.message || "Login failed");
            })
        }
    }


    return (
        <>
            <section className="relative w-full min-h-screen flex items-center justify-center px-4">

                {/* Background */}
                <img
                    src={Images.LoginBg}
                    alt="background"
                    className="absolute inset-0 w-full h-full object-cover -z-10"
                />

                {/* Form */}
                <form
                    onSubmit={onsubmit}
                    className="w-full max-w-md sm:max-w-lg lg:max-w-md 
      flex flex-col gap-4 p-6 rounded-xl 
      bg-white/60 backdrop-blur-md border border-gray-200 shadow-sm"
                >

                    {/* Title */}
                    <p className="text-center font-semibold text-(--color-text)">
                        Signin
                    </p>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Email ID</label>
                        <input
                            type="email"
                            placeholder="Enter Email ID"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="px-3 py-2 rounded-md bg-gray-100/70 border border-gray-200 
        focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Password</label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="px-3 py-2 rounded-md bg-gray-100/70 border border-gray-200 
        focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                        />
                    </div>

                    {/* Re-Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Re-enter Password"
                            value={repassword}
                            onChange={(e) => setRePassword(e.target.value)}
                            required
                            className="px-3 py-2 rounded-md bg-gray-100/70 border border-gray-200 
        focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="mt-4 py-2 rounded-md bg-(--color-primary) text-(--color-white) 
      hover:scale-105 transition duration-200 cursor-pointer"
                    >
                        Signin
                    </button>

                    {/* Footer */}
                    <p className="text-sm text-gray-500 text-center mt-2">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate('/login')}
                            className="text-(--color-primary) underline cursor-pointer"
                        >
                            Login
                        </span>
                    </p>

                </form>

            </section>
        </>
    )
}

export default signin