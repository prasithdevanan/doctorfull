import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate} from 'react-router-dom';


function Payment() {

    const location = useLocation();
    const navigate = useNavigate();

    const element = location.state ? location.state.element: false;;

    useEffect(() => {
        if (!location.state?.fromBooking) {
          navigate('/doctor'); 
        }
    }, []);
   
  return (
    <>
    <div>
        <p>{element.name}</p>
    </div>
    </>
  )
}

export default Payment;