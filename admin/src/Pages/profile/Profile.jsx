import { useState, useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
    const { aToken, dToken, BackendUrl } = useContext(AdminContext);
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState(aToken ? "Admin" : localStorage.getItem("dEmail").split("@")[0]);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);

    // profile
    const [profile, setProfile] = useState({
        name: name,
        email: aToken ? "admin@metix.com" : localStorage.getItem("dEmail"),
        mobile: aToken ? "N/A" : "Enter phone number",
        role: aToken ? "Admin" : "Doctor",
        image: null,
    });

    // handle the change on Edit
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => {
            const updatedProfile = { ...prev, [name]: value };
            return updatedProfile;
        })
    };


    // handle the image upload
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile({
                ...profile,
                image: "",
                imageFile: file,
                imagePreview: URL.createObjectURL(file),
            });
        }
    };

    // handle the save on DB 
    const handleSave = async () => {
        setProfileLoading(true);
        const formData = new FormData();
        formData.append("name", profile.name);
        formData.append("email", profile.email);
        formData.append("mobile", profile.mobile);
        formData.append("image", profile.imageFile);
        try {
            const res = await axios.post(`${BackendUrl}/api/doctor/doctor/profile/update/${localStorage.getItem("id")}`, formData);

            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setEdit(false);
            setProfileLoading(false);
        }
    };

    /// handle the logout
    const logout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    // Fetch doctor info
    useEffect(() => {
        if (aToken) return; // If admin, skip fetching doctor info
        try {
            setLoading(true);
            const fetchDoctorInfo = async () => {
                const res = await axios.get(`${BackendUrl}/api/doctor/doctor/email/${profile.email}`);
                setProfile({
                    ...profile,
                    mobile: res.data.doctor.mobile || profile.mobile,
                    image: res.data.doctor.image || profile.image,
                    imagePreview: res.data.doctor.image || profile.imagePreview,
                    role: res.data.doctor.role || profile.role,
                    name: res.data.doctor.name || profile.name,
                });
            }
            fetchDoctorInfo();
        } catch (err) {
            if (err.response.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <section className="h-[calc(100vh-60px)] w-full overflow-y-auto bg-slate-50">

            {loading ? (

                <div className="flex h-full items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                        <p className="text-xs font-medium text-slate-400">
                            Loading profile...
                        </p>
                    </div>
                </div>

            ) : (

                <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">

                    {/* ================= PAGE HEADER ================= */}
                    <div className="mb-5">

                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-600" />

                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                                Account Settings
                            </span>
                        </div>

                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Profile
                        </h1>

                        <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                            Manage your personal information and account details
                        </p>

                    </div>


                    {/* ================= PROFILE HERO ================= */}
                    <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">

                        {/* Background */}
                        <div className="relative h-28 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900">

                            <div className="absolute -right-10 -top-20 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />

                            <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />

                        </div>


                        {/* Profile */}
                        <div className="relative px-5 pb-5 sm:px-7">

                            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                                {/* LEFT */}
                                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end">

                                    {/* Avatar */}
                                    <div className="group relative">

                                        <div className="h-24 w-24 overflow-hidden rounded-[24px] border-4 border-white bg-slate-100 shadow-lg">

                                            <img
                                                src={
                                                    profile.imagePreview ||
                                                    profile.image ||
                                                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                                }
                                                alt="profile"
                                                className="h-full w-full object-cover"
                                            />

                                        </div>

                                        {edit && (
                                            <label className="absolute inset-1 flex cursor-pointer items-center justify-center rounded-[20px] bg-black/50 text-white opacity-0 transition group-hover:opacity-100">

                                                <div className="flex flex-col items-center gap-1">
                                                    <i className="bi bi-camera text-lg" />
                                                    <span className="text-[9px] font-semibold">
                                                        Change
                                                    </span>
                                                </div>

                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="image/*"
                                                    onChange={handleImage}
                                                />

                                            </label>
                                        )}

                                    </div>


                                    {/* USER INFO */}
                                    <div className="pb-1">

                                        <h2 className="text-xl font-bold text-white">
                                            {profile.name || "User"}
                                        </h2>

                                        <p className="mt-0.5 text-xs text-slate-400">
                                            {profile.email}
                                        </p>

                                        <div className="mt-2 flex flex-wrap items-center gap-2">

                                            <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
                                                <i className="bi bi-shield-check" />
                                                {profile.role}
                                            </span>

                                            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                Active
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* EDIT BUTTON */}
                                <button
                                    type="button"
                                    onClick={() => setEdit(!edit)}
                                    className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition-all active:scale-[0.98] ${edit
                                            ? "border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            : "bg-slate-900 text-white shadow-sm hover:bg-blue-600"
                                        }`}
                                >

                                    <i className={`bi ${edit ? "bi-x-lg" : "bi-pencil"}`} />

                                    {edit ? "Cancel" : "Edit Profile"}

                                </button>

                            </div>

                        </div>

                    </div>


                    {/* ================= ACCOUNT DETAILS ================= */}
                    <div className="mt-4 rounded-[24px] border border-slate-200 bg-white shadow-sm">

                        {/* Section Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">

                            <div>
                                <h2 className="text-sm font-bold text-slate-800">
                                    Personal Information
                                </h2>

                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    Update the information associated with your account
                                </p>
                            </div>

                            <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex">
                                <i className="bi bi-person-vcard text-sm" />
                            </div>

                        </div>


                        {/* FORM */}
                        <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 sm:px-7">

                            {/* NAME */}
                            <div>

                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    Full Name
                                </label>

                                <div className="relative">

                                    <i className="bi bi-person absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300" />

                                    <input
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        disabled={!edit}
                                        className={`h-11 w-full rounded-xl border pl-9 pr-3 text-xs outline-none transition ${edit
                                                ? "border-slate-200 bg-white text-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                                                : "border-slate-100 bg-slate-50 text-slate-500"
                                            }`}
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}
                            <div>

                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    Email Address
                                </label>

                                <div className="relative">

                                    <i className="bi bi-envelope absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300" />

                                    <input
                                        value={profile.email}
                                        disabled
                                        className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50 pl-9 pr-3 text-xs text-slate-400 outline-none"
                                    />

                                </div>

                                <p className="mt-1 text-[9px] text-slate-300">
                                    Email address cannot be changed
                                </p>

                            </div>


                            {/* PHONE */}
                            <div>

                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    Phone Number
                                </label>

                                <div className="relative">

                                    <i className="bi bi-telephone absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300" />

                                    <input
                                        name="mobile"
                                        value={profile.mobile}
                                        onChange={handleChange}
                                        disabled={!edit}
                                        className={`h-11 w-full rounded-xl border pl-9 pr-3 text-xs outline-none transition ${edit
                                                ? "border-slate-200 bg-white text-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                                                : "border-slate-100 bg-slate-50 text-slate-500"
                                            }`}
                                    />

                                </div>

                            </div>


                            {/* ROLE */}
                            <div>

                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    Account Role
                                </label>

                                <div className="relative">

                                    <i className="bi bi-shield-lock absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300" />

                                    <input
                                        value={profile.role}
                                        disabled
                                        className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50 pl-9 pr-3 text-xs font-medium text-slate-500 outline-none"
                                    />

                                </div>

                                <p className="mt-1 text-[9px] text-slate-300">
                                    Role is managed by the administrator
                                </p>

                            </div>

                        </div>


                        {/* ================= ACTION BAR ================= */}
                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">

                            <button
                                type="button"
                                onClick={logout}
                                className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-4 text-xs font-semibold text-red-500 transition hover:bg-red-50 active:scale-[0.98]"
                            >
                                <i className="bi bi-box-arrow-right" />
                                Sign Out
                            </button>


                            {edit && (
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={profileLoading}
                                    className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {profileLoading ? (
                                        <>
                                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check2" />
                                            Save Changes
                                        </>
                                    )}

                                </button>
                            )}

                        </div>

                    </div>

                </div>

            )}

        </section>
    );
}

export default Profile;