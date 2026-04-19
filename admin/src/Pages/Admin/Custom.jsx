import React, { useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';

function Custom() {
    const [image, setImage] = useState(null);
    const [companyName, setCompanyName] = useState('');
    const { BackendUrl } = useContext(AdminContext);
    const { aToken } = useContext(AdminContext);

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

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
    formDate.append('logo', image);
    formDate.append('companyName', companyName);

    // submit
    const submitHandler = () => {
        try {
            const res = axios.post(`${BackendUrl}/api/admin/custom`, formDate, {
                headers: {
                    aToken
                }
            });
            console.log(res);

            if (res.data.success){
                console.log(res.data.message);
            }
            console.log(res);
        } catch (error) {
            console.log(error);
        }

    }


    return (
        <>
            <section>
                {/* /* //------------------------------------------logo----------------------- */}
                <div>
                    <label htmlFor="_logo" onDrop={handleDrag} onDragOver={handleDrageEnd} className="w-30 h-30 bg-amber-100 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-gray-300">
                        {
                            image ? <img src={URL.createObjectURL(image)} alt="logo" /> : <p>Drag and Drop</p>
                        }
                        <input type="file" id='_logo' className='hidden' onChange={handleChange} />
                    </label>

                    <div>
                        <h1>Company Name</h1>
                        <input type="text" placeholder='Enter company Name' onChange={(e) => setCompanyName(e.target.value)} value={companyName} className='py-1 bg-gray-100 px-2' />
                    </div>

                    <button onClick={submitHandler} className='px-3 py-2 bg-(--color-primary)'>Submit</button>
                </div>
            </section>
        </>
    )
}

export default Custom;