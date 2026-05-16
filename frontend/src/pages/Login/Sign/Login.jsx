import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../../component/CreateContext';
import { Images } from '../../../assets/img';


function Login() {
    const {
        BackendUrl,
        setToken,
        setUser,
        userId,
        setUserId
    } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState("Login");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("Patient");

    const [passwordVisible, setPasswordVisible] = useState(false);


    const useFuntion = async (e) => {

        e.preventDefault();

        if (!email || !password) {
            return toast.error("Missing data");
        }

        try {

            setLoading(true);

            const res = await axios.post(
                BackendUrl + '/api/patient/login',
                { email, password }
            );

            if (res.data.success) {

                toast.success(res.data.message);

                localStorage.setItem(
                    'userId',
                    res.data.user.id
                );

                setUserId(res.data.user.id);
                setToken(true);
                setUser(res.data.user);
                navigate('/');

            } else {
                toast.error(res.data.message);
            }

        } catch (err) {
            toast.error(
                err.response?.data?.message || "Login failed"
            );

        } finally {

            setLoading(false);
        }
    }
    return (
        <>
            <section className="relative w-full min-h-screen flex items-center justify-center px-4 sm:overflow-hidden">


                <img src={Images.LoginBg} alt="Login Background" className="absolute inset-0 w-full h-full object-cover -z-10"
                />


                <form
                    onSubmit={useFuntion}
                    autoComplete="on"
                    className="w-full max-w-md sm:max-w-lg lg:max-w-md  flex flex-col gap-4 p-6 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 shadow-sm"
                >


                    <p className="text-center font-semibold text-(--color-text)">
                        {status}
                    </p>


                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Email ID</label>
                        <input
                            type="email"
                            placeholder="Enter Email ID"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                            className="px-3 py-2 rounded-md bg-gray-100/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                        />
                    </div>


                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Password</label>

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
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 py-2 rounded-md bg-(--color-primary) text-(--color-white) 
      hover:scale-105 transition duration-200 cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>


                    <p className="text-sm text-gray-500 text-center mt-2">
                        Don't have an account?{" "}
                        <span
                            onClick={() => navigate('/signin')}
                            className="text-(--color-primary) underline cursor-pointer"
                        >
                            Signin
                        </span>
                    </p>

                </form>

            </section>
        </>
    )
}

export default Login