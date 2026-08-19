import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from '../../../component/CreateContext';
import { toast } from 'react-toastify';

const GoogleSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { BackendUrl, setToken, setUser, setUserId } = useContext(AppContext);

    useEffect(() => {
        const getUser = async () => {
            const token = searchParams.get("token");
            console.log(token);
            if (!token) {
                toast.error("Missing auth token");
                navigate("/login");
                return;
            }

            localStorage.setItem("authToken", token);

            try {
                const response = await fetch(`${BackendUrl}/api/patient/auth/me`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (data.success) {
                    toast.success("Login successful");
                    localStorage.setItem("userId", data.user.id);
                    localStorage.setItem("patientId", data.user.patientId);
                    setUserId(data.user.id);
                    setUser(data.user);
                    setToken(true);
                    navigate("/");
                } else {
                    toast.error(data.message);
                    navigate("/login");
                }
            } catch (error) {
                console.error(error);
                navigate("/login");
            }
        };

        getUser();
    }, [navigate]);

    return (
        <section className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl border border-gray-100">

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-(--color-primary)/10">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-(--color-primary)" />
                </div>

                <h1 className="text-xl font-bold text-gray-800">
                    Signing you in...
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Please wait while we securely verify your Google account.
                </p>

            </div>
        </section>
    );
};

export default GoogleSuccess;