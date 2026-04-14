import React, { useEffect, useContext, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../component/CreateContext';
import { Images } from '../assets/img';


function Payment() {

  useEffect(() => {
    if (!location.state?.fromBooking) {
      navigate('/doctor');
    }
  }, []);
  const { token } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const height = window.innerHeight - 120; // Subtracting the height of the navbar (assuming it's 120px)
  console.log(location);
  const element = location.state ? location.state.element : false;
  const date = location.state ? location?.state?.selectDate : false;
  const time = location.state ? location?.state?.selectTime : false;

  ///check the active button
  const [paymentMethod, setPaymentMethod] = useState(true);



  return (
    <>
      {
        token ? (
          <div className='px-4 h-[calc(100vh-120px)] flex gap-5 w-full'>
            <div
              className="bg-purple-100 px-4 flex flex-col gap-3 py-4 h-full rounded-md w-1/5">
              <p
                className="font-medium">
                Appointment Summary
              </p>

              {/* doctor information */}
              <div
                className="flex items-center gap-2 p-2 bg-white rounded-md relative">
                <img
                  src={element.image}
                  alt="profile"
                  className="w-16 h-16 rounded-full bg-amber-200 object-contain"
                />

                {/* availability dot */}
                <div
                  className="w-5 h-5 bg-green-800/50 rounded-full absolute top-2 left-2 available flex justify-center items-center">
                  <div
                    className="w-3 h-3 bg-green-800 rounded-full">

                  </div>
                </div>

                <div
                  className="flex flex-col">
                  <h2
                    className="font-medium text-sm text-(--color-text)">
                    {element.name}
                  </h2>
                  <p
                    className="font-light text-sm text-(--color-text1)">
                    {element.speciality}
                  </p>
                </div>
              </div>

              {/* date and time slot */}
              <div
                className="flex items-center gap-2">
                <h2
                  className="bg-blue-600/20 px-3 py-2 rounded-md">
                  <i
                    className="bi bi-calendar4 text-blue-600">
                  </i>
                </h2>

                <div
                  className="flex flex-col">
                  <p
                    className="font-light text-xs text-(--color-text1)">
                    DATE & TIME SLOT
                  </p>
                  <h2
                    className="font-medium text-xs tracking-wide">
                    {date},
                    {time}
                  </h2>
                </div>
              </div>

              {/* doctor location */}
              <div
                className="flex items-start gap-2">
                <h1
                  className="bg-blue-600/20 px-3 py-2 rounded-md">
                  <i
                    className="bi bi-geo-alt text-blue-600">
                  </i>
                </h1>

                <div
                  className="flex flex-col">
                  <p
                    className="font-light text-xs text-(--color-text1)">
                    LOCATION
                  </p>
                  <h2
                    className="font-medium text-xs">
                    {element?.address?.address1},
                    <br />
                    {element?.address?.address2}
                  </h2>
                </div>
              </div>
            </div>

            {/* //Payment side */}
            <div className='bg-purple-50 w-2/2'>
              <h1>
                Payment
              </h1>
              <div
                className='flex gap-4 justify-center'>
                <button
                  className={`px-4 py-2 ${paymentMethod ? "bg-(--color-primary)  text-white" : "bg-(--color-primary)/20 text-(--color-primary)"} rounded-md cursor-pointer hover:transform  hover:scale-110  duration-200 ease-in`}
                  onClick={(e) => setPaymentMethod(true)}
                >
                  <i className="bi bi-apple mr-1"></i>
                  Apple Pay
                </button>
                <button
                  className={`px-4 py-2 ${!paymentMethod ? 'bg-(--color-primary) text-white' : "bg-(--color-primary)/20 text-(--color-primary)"} rounded-md cursor-pointer hover:transform  hover:scale-110  duration-200 ease-in`}
                  onClick={(e) => setPaymentMethod(false)}
                >
                  Razor Pay
                </button>
              </div>

              {
                paymentMethod &&
                <div>
                  <p>This is an Apple pay</p>
                </div>

              }

              {
                !paymentMethod &&
                <div>
                  <p>THis is an Razor pay</p>
                </div>
              }
            </div>
          </div>
        ) : (
          <div className={` flex flex-col justify-center items-center mt-3 h-[calc(100vh-120px)] `}>
            <img
              src={Images.Login}
              alt="Login"
              className='w-md mx-auto' />
            <p
              className='mx-auto'>
              Please
              <Link
                to="/login"
                className='text-(--color-primary) font-bold underline'
                state={{ from: location.pathname }}>
                login
              </Link>
              to access the payment page.
            </p>
          </div>
        )
      }

    </>
  )
}

export default Payment;