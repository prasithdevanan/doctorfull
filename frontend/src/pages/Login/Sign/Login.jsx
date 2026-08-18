import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../../component/CreateContext';
import { Images } from '../../../assets/img';
import { socket } from '../../../socket/socket';


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
    const [loginStatus, setLoginStatus] = useState(false);

    const [passwordVisible, setPasswordVisible] = useState(false);


    const useFuntion = async (e) => {

        e.preventDefault();

        if (loading) return;

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
            socket.connect();
            setLoading(false);
        }
    }


    const googleLogin = () => {
        setLoginStatus(true);
        window.location.href = BackendUrl + "/api/patient/auth/google";
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const googleError = params.get("googleError");

        if (googleError) {
            setLoginStatus(false);

            toast.error("Google login failed. Please try again.");

            // Remove error from URL
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );
        }
    }, []);


    return (
        <>
            <section className="relative w-full min-h-screen flex items-center justify-center px-4 sm:overflow-hidden">

                <h1 className="absolute top-10 left-4 sm:left-10 text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase leading-tight text-white">
                    Caring for life,{" "}
                    <span className="outlined-text text-(--color-primary)">
                        one patient
                    </span>
                    <br />
                    at a time
                </h1>

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
                        disabled={loading} className="mt-2 w-full rounded-lg bg-(--color-primary) px-4 py-3 text-sm font-semibold text-(--color-white) shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                        {loading ? "Signing in..." : "Login"}
                    </button>
                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-300" />
                        <span className="text-xs font-medium text-gray-400">
                            OR
                        </span>
                        <div className="h-px flex-1 bg-gray-300" />
                    </div>
                    <button type="button"
                        onClick={() => googleLogin()}
                        className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer">

                        <svg
                            width="20" height="20" viewBox="0 0 18 18" aria-hidden="true"><path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4" /><path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957273V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853" /><path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05" /><path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957273 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335" />
                        </svg>
                        <span>{loginStatus ? "Logging in..." : "Login with Google"}</span>
                    </button>

                    <p className="text-sm text-gray-500 text-center mt-2">
                        Don't have an account?{" "}
                        <span
                            onClick={() => navigate('/signin')}
                            className="text-(--color-primary) underline cursor-pointer"
                        >
                            SignUp
                        </span>
                    </p>

                </form>

            </section>
        </>
    )
}

export default Login