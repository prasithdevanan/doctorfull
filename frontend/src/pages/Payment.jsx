import React, { useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../component/CreateContext';
import { Images } from '../assets/img';


function Payment() {

  const { token } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const height = window.innerHeight - 120; // Subtracting the height of the navbar (assuming it's 120px)
  console.log(height);
  const element = location.state ? location.state.element : false;


  useEffect(() => {
    if (!location.state?.fromBooking) {
      navigate('/doctor');
    }
  }, []);

  return (
    <>
      {
        token ? (
          <div>
            <p>{element.image}</p>
            <img src={element.image} alt="doctor" />
          </div>
        ) : (
          <div className={`w-full flex flex-col justify-center items-center mt-3 h-[calc(100vh-120px)] `}>
            <img src={Images.Login} alt="Login" className='w-md mx-auto'/>
            <p className='mx-auto'>Please <Link to="/login" className='text-(--color-primary) font-bold underline' state={{from:location.pathname}}>login</Link> to access the payment page.</p>
          </div>
        )
    }

    </>
  )
}

export default Payment;