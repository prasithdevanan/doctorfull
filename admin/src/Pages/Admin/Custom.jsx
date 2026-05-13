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
            console.log(res.data);

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
        <>
            <section className="w-full flex justify-center px-4 sm:px-6 py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 h-screen">

                <div className="w-full h-fit max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 flex flex-col items-center gap-6 my-auto">

                    {/* Logo Upload */}
                    <label
                        htmlFor="_logo"
                        onDrop={handleDrag}
                        onDragOver={handleDrageEnd}
                        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition group bg-gray-50 group"
                    >
                    <div className='group-hover:opacity-100 opacity-0 inset-0 bg-black/20 flex items-center justify-center absolute text-white backdrop-blur-[1px]'>
                        Upload
                    </div>
                        {preview ? (
                            <img src={preview} alt="logo" className="w-full h-full object-cover" />
                        ) : backendImg ? (
                            <img src={backendImg} alt="logo" className="w-full h-full object-cover" />
                        ) : (
                            <p className="text-xs text-gray-400 text-center px-2 group-hover:text-blue-500 transition">
                                Upload Logo
                            </p>
                        )}

                        <input
                            type="file"
                            id="_logo"
                            className="hidden"
                            onChange={handleChange}
                        />
                    </label>

                    {/* Company Name */}
                    <div className="w-full flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Company Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter company name"
                            onChange={(e) => setCompanyName(e.target.value)}
                            value={companyName || ""}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={submitHandler}
                        className="cursor-pointer w-full sm:w-auto px-6 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition"
                    >
                        Save Changes
                    </button>

                </div>
            </section>
        </>
    )
}

export default Custom;