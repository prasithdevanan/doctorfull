import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function AppointmentBtn() {
    const location = useLocation();
    const navigate = useNavigate();
    const locationAllow = ["/", "/home", "/doctor", "/about", "/contact"];
    const allow = locationAllow.includes(location.pathname);
    console.log(allow + "---------------");
    console.log(location.pathname);


    const handleAppointment = () => {
        navigate('/appointment');
    }
    return (
        allow &&
        <div className="fixed bottom-6 right-6 z-50">
            <button type="button" onClick={handleAppointment} className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-(--color-primary-gradient) text-white cursor-pointer shadow-lg transition-all duration-150 ease-in-out hover:scale-105 hover:bg-linear-(--color-primary-gradient-hover) hover:shadow-2xl" title="Book Appointment">
                <i className="bi bi-calendar-plus text-xl"></i>
            </button>
        </div>
    )
}

export default AppointmentBtn;