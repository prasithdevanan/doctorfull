import React, { useState, useContext, useEffect, use } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';


function Custom() {
    const [image, setImage] = useState(true);
    const { BackendUrl, backendImg, name } = useContext(AdminContext);
    const [companyName, setCompanyName] = useState(name || null);
    const { aToken } = useContext(AdminContext);
    const [preview, setPreview] = useState(null);

    console.log(backendImg);
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
                console.log(res.data.message);
            }
            console.log(res.data);
        } catch (error) {
            console.log(error);
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
            <section className="flex flex-col items-center justify-center gap-6 p-4 sm:p-6 w-full">

                {/* Logo Upload */}
                <label
                    htmlFor="_logo"
                    onDrop={handleDrag}
                    onDragOver={handleDrageEnd}
                    className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-amber-100 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-gray-300"
                >
                    {preview ? (
                        <img src={preview} alt="logo" className="w-full h-full object-cover" />
                    ) : backendImg ? (
                        <img src={backendImg} alt="logo" className="w-full h-full object-cover" />
                    ) : (
                        <p className="text-xs text-gray-500 text-center px-2">
                            Drag & Drop
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
                <div className="w-full max-w-sm flex flex-col gap-2">
                    <h1 className="text-lg font-semibold text-center sm:text-left">
                        Company Name
                    </h1>

                    <input
                        type="text"
                        placeholder="Enter company Name"
                        onChange={(e) => setCompanyName(e.target.value)}
                        value={companyName || ""}
                        className="py-2 px-3 bg-gray-100 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={submitHandler}
                    className="px-6 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition w-full sm:w-auto cursor-pointer"
                >
                    Submit
                </button>

            </section>
        </>
    )
}

export default Custom;