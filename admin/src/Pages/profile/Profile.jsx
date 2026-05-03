import { useState, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";

function Profile() {
    const { aToken, dToken, BackendUrl } = useContext(AdminContext);
    const [edit, setEdit] = useState(false);
    console.log(aToken, dToken);

    const [profile, setProfile] = useState({
        name: "Admin User",
        email: aToken ? "admin@metix.com" : localStorage.getItem("dEmail"),
        phone: "+91 9876543210",
        role: "Administrator",
        image: null,
    });

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile({
                ...profile,
                image: URL.createObjectURL(file),
            });
        }
    };

    const handleSave = () => {
        setEdit(false);
        console.log("Saved:", profile);
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <section className="h-[calc(100vh-60px)] w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-4xl backdrop-blur-xl bg-white/70 border border-white/30 shadow-2xl rounded-3xl p-6 sm:p-10 transition-all duration-300">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
                        <p className="text-sm text-gray-500">Manage your account details</p>
                    </div>

                    <button
                        onClick={() => setEdit(!edit)}
                        className="cursor-pointer px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition"
                    >
                        {edit ? "Cancel" : "Edit"}
                    </button>
                </div>

                {/* PROFILE CARD */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">

                    <div className="relative group">
                        <img
                            src={
                                profile.image ||
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt="profile"
                            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                        />

                        {edit && (
                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
                                Upload
                                <input type="file" hidden onChange={handleImage} />
                            </label>
                        )}
                    </div>

                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-semibold text-gray-800">{profile.name}</h2>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-medium">
                            {profile.role}
                        </span>
                    </div>

                </div>

                {/* FORM */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    {/* Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Full Name</label>
                        <input
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            disabled={!edit}
                            className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 focus:ring-2 focus:ring-blue-400 outline-none transition"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Email</label>
                        <input
                            value={profile.email}
                            disabled
                            className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-100 text-gray-500"
                        />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Phone</label>
                        <input
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            disabled={!edit}
                            className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 focus:ring-2 focus:ring-blue-400 outline-none transition"
                        />
                    </div>

                    {/* Role */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Role</label>
                        <input
                            value={profile.role}
                            disabled
                            className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-100 text-gray-500"
                        />
                    </div>

                </div>

                {/* ACTIONS */}
                <div className="flex justify-between items-center mt-10 flex-wrap gap-4">

                    <button
                        onClick={logout}
                        className="cursor-pointer px-6 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg transition"
                    >
                        Logout
                    </button>

                    {edit && (
                        <button
                            onClick={handleSave}
                            className="cursor-pointer px-8 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transition"
                        >
                            Save Changes
                        </button>
                    )}
                </div>

            </div>
        </section>
    );
}

export default Profile;