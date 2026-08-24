import React, { useState, useContext, useEffect, use } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';


function Custom() {
    const [image, setImage] = useState(true);
    const { BackendUrl, backendImg, name } = useContext(AdminContext);
    const [companyName, setCompanyName] = useState(name || null);
    const { aToken } = useContext(AdminContext);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    useEffect(() => {
        setCompanyName(name);
    }, [name]);



    // drag and drop
    const handleDrag = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setImage(file);
        }
    }

    // drop
    const handleDrageEnd = (e) => {
        e.preventDefault();
    }
    const formDate = new FormData();
    formDate.append('image', image);
    formDate.append('companyName', companyName);

    // submit
    const submitHandler = async () => {
        try {
            const res = await axios.post(`${BackendUrl}/api/admin/custom`, formDate, {
                headers: {
                    aToken
                }
            });

            if (res.data.success) {
                toast.success(res.data.message);
            }
            toast.error(res.data.message);

        } catch (error) {
            toast.error(error?.response?.data?.message);
        }

    }

    useEffect(() => {
        if (image instanceof File) {
            const url = URL.createObjectURL(image);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [image])


    return (
        <section className="h-[calc(100vh-60px)] w-full overflow-y-auto bg-slate-50">

            <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">

                {/* ================= PAGE HEADER ================= */}
                <div className="mb-5">

                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                            Organization Settings
                        </span>
                    </div>

                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                        Company Profile
                    </h1>

                    <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                        Manage your company name and branding
                    </p>

                </div>


                {/* ================= MAIN CARD ================= */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* ================= SECTION HEADER ================= */}
                    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <i className="bi bi-building text-sm" />
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-slate-800">
                                Organization Information
                            </h2>

                            <p className="mt-0.5 text-[11px] text-slate-400">
                                Update your company identity and logo
                            </p>
                        </div>

                    </div>


                    {/* ================= FORM ================= */}
                    <div className="px-5 py-5 sm:px-6">

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr]">

                            {/* ================= LOGO ================= */}
                            <div>

                                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    Company Logo
                                </label>

                                <label
                                    htmlFor="_logo"
                                    onDrop={handleDrag}
                                    onDragOver={handleDrageEnd}
                                    className="group relative flex h-40 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-slate-50 transition hover:border-blue-300 hover:bg-blue-50/30"
                                >

                                    {preview ? (

                                        <img
                                            src={preview}
                                            alt="Company logo"
                                            className="h-full w-full object-contain p-3"
                                        />

                                    ) : backendImg ? (

                                        <img
                                            src={backendImg}
                                            alt="Company logo"
                                            className="h-full w-full object-contain p-3"
                                        />

                                    ) : (

                                        <div className="flex flex-col items-center">

                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-300 shadow-sm">
                                                <i className="bi bi-image text-lg" />
                                            </div>

                                            <p className="mt-2 text-[10px] font-semibold text-slate-500">
                                                Upload Logo
                                            </p>

                                            <p className="mt-0.5 text-[9px] text-slate-400">
                                                PNG, JPG
                                            </p>

                                        </div>

                                    )}


                                    {/* HOVER OVERLAY */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 opacity-0 transition group-hover:opacity-100">

                                        <div className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[10px] font-semibold text-slate-700 shadow-sm">
                                            <i className="bi bi-camera" />
                                            Change Logo
                                        </div>

                                    </div>


                                    <input
                                        type="file"
                                        id="_logo"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleChange}
                                    />

                                </label>

                                <p className="mt-2 max-w-[160px] text-[9px] leading-4 text-slate-400">
                                    Use a square image for the best appearance.
                                </p>

                            </div>


                            {/* ================= DETAILS ================= */}
                            <div className="flex flex-col">

                                <div>

                                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                        Company Name
                                    </label>

                                    <div className="relative">

                                        <i className="bi bi-building absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300" />

                                        <input
                                            type="text"
                                            placeholder="Enter company name"
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            value={companyName || ""}
                                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                                        />

                                    </div>

                                    <p className="mt-1.5 text-[9px] text-slate-400">
                                        This name will be displayed throughout your application.
                                    </p>

                                </div>


                                {/* PREVIEW */}
                                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-3">

                                    <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                        Brand Preview
                                    </p>

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">

                                            {preview || backendImg ? (

                                                <img
                                                    src={preview || backendImg}
                                                    alt="Preview"
                                                    className="h-full w-full object-contain p-1"
                                                />

                                            ) : (

                                                <i className="bi bi-building text-sm text-slate-300" />

                                            )}

                                        </div>

                                        <div className="min-w-0">

                                            <p className="truncate text-xs font-semibold text-slate-700">
                                                {companyName || "Your Company"}
                                            </p>

                                            <p className="text-[9px] text-slate-400">
                                                Company identity
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================= ACTION BAR ================= */}
                    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">

                        <button
                            type="button"
                            onClick={submitHandler}
                            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] sm:w-auto"
                        >

                            <i className="bi bi-check2" />

                            Save Changes

                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Custom;