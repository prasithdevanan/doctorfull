import React, { useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../component/CreateContext';


function Payment() {

  const { token } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

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
          <div>
            <Link to={'/login'}>Login</Link>
          </div>
        )
    }

    </>
  )
}

export default Payment;