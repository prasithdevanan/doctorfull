import React, { useEffect, useContext, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../component/CreateContext';
import { Images } from '../assets/img';
import axios from 'axios';
import { toast } from 'react-toastify';


function Payment() {

  useEffect(() => {
    if (!location.state?.fromBooking) {
      navigate('/doctor');
    }
  }, []);
  const { token, BackendUrl } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const height = window.innerHeight - 120; // Subtracting the height of the navbar (assuming it's 120px)
  console.log(location);
  const element = location.state ? location.state.element : false;
  const date = location.state ? location?.state?.selectDate : false;
  const time = location.state ? location?.state?.selectTime : false;

  ///check the active button
  const [paymentMethod, setPaymentMethod] = useState(true);

  const amount = 500;
  const currency = "INR";
  const receiptId = "order_rcptid_11";



  //handle payment method
  const handlePayment = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${BackendUrl}/api/admin/order`, { amount, currency, receipt: receiptId }, { headers: "Content-Type: application/json" });
    if (!res.data.success) {
      return console.log(res.data.message);
    }

    console.log(res.data.order.id);

    const options = {
      "key": 'rzp_test_SgAnRohB2gqLpU', // Replace with your Razorpay key_id
      amount, // Amount is in currency subunits.
      currency,
      "name": 'Metix',
      "description": 'Test Transaction',
      "order_id": res.data.order.id, // This is the order_id created in the backend
      "handler": async function (response) {
        const body = {
          ...response,
        };

        const validation = await axios.post(`${BackendUrl}/api/admin/order/verify`, body, { headers: "Content-Type: application/json" });
        console.log(validation.data);
      },
      "prefill": {
        "name": 'Alex',
        "email": 'alex@example.com',
        "contact": '9999999999'
      },
      "theme": {
        "color": '#F37254'
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response) {
      const error = response.error;

      toast.error(error.description || 'Payment failed. Please try again');


      ///log full other error
      console.log('Razorpay Error', {
        "code": error.code,
        "description": error.description,
        "source": error.source,
        "step": error.step,
        "reason": error.reason,
        "order_id": error.metadata?.order_id,
        "payment_id": error.metadata?.payment_id
      })
    });
    rzp1.open();


  }



  return (
    <>
      {
        token ? (

          <div className="w-full min-h-[calc(100vh-120px)] px-4 py-6 
      flex flex-col lg:flex-row gap-6 items-start justify-center">

            {/* LEFT - Appointment Summary */}
            <div className="w-full lg:w-1/3 bg-purple-50 rounded-xl p-5 flex flex-col gap-5">

              <h2 className="font-semibold text-lg text-(--color-text)">
                Appointment Summary
              </h2>

              {/* Doctor */}
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg relative shadow-sm">

                <img
                  src={element.image}
                  alt="doctor"
                  className="w-16 h-16 rounded-full object-cover bg-gray-100"
                />

                {/* Availability */}
                <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-(--color-text)">
                    {element.name}
                  </h3>
                  <p className="text-xs text-(--color-text1)">
                    {element.speciality}
                  </p>
                </div>

              </div>

              {/* Date & Time */}
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 px-3 rounded-full">
                  <i className="bi bi-calendar4 text-blue-500"></i>
                </div>

                <div>
                  <p className="text-xs text-(--color-text1)">
                    DATE & TIME
                  </p>
                  <p className="text-sm font-medium">
                    {date}, {time}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/10 p-2 px-3 rounded-full">
                  <i className="bi bi-geo-alt text-blue-500"></i>
                </div>

                <div>
                  <p className="text-xs text-(--color-text1)">
                    LOCATION
                  </p>
                  <p className="text-sm">
                    {element?.address?.address1},
                    <br />
                    {element?.address?.address2}
                  </p>
                </div>
              </div>

              {/* Total fees */}
              <div className="w-full bg-white rounded-xl p-5 shadow-sm flex flex-col gap-3 max-w-md">

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Consultation Fees</span>
                  <span className="font-medium text-gray-800">
                    ₹ {element.fees}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Service Charge</span>
                  <span className="font-medium text-gray-800">
                    ₹ 200
                  </span>
                </div>
                <hr className="my-1 border-gray-200" />
                <div className="flex justify-between text-base font-semibold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-(--color-primary)">
                    ₹ {element.fees + 200}
                  </span>
                </div>

              </div>

            </div>

            {/* RIGHT - Payment */}
            <div className="w-full lg:w-2/3 bg-white rounded-xl p-6 shadow-sm flex flex-col gap-6 h-full">

              <h1 className="text-xl font-semibold text-(--color-text) text-center">
                Payment
              </h1>

              {/* Payment Method */}
              <div className="flex flex-wrap gap-3 justify-center">

                <button
                  onClick={() => setPaymentMethod(true)}
                  className={`px-5 py-2 rounded-md text-sm flex items-center gap-2 transition duration-200 cursor-pointer
              ${paymentMethod
                      ? "bg-(--color-primary) text-(--color-white)"
                      : "bg-(--color-primary)/20 text-(--color-primary)"
                    } hover:scale-105`}
                >
                  <i className="bi bi-apple"></i>
                  Apple Pay
                </button>

                <button
                  onClick={() => setPaymentMethod(false)}
                  className={`px-5 py-2 rounded-md text-sm flex items-center gap-2 transition duration-200 cursor-pointer
              ${!paymentMethod
                      ? "bg-(--color-primary) text-(--color-white)"
                      : "bg-(--color-primary)/20 text-(--color-primary)"
                    } hover:scale-105`}
                >
                  Razor Pay
                </button>

              </div>

              {/* Payment Content */}
              <div className="bg-gray-50 p-4 rounded-lg min-h-[150px] flex items-center justify-center text-center">

                {paymentMethod ? (
                  <div>
                    <h2 className="font-semibold mb-2">Apple Pay</h2>
                    <p className="text-sm text-gray-500">
                      Pay securely using Apple Pay.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="font-semibold mb-2">Razorpay</h2>
                    <p className="text-sm text-gray-500">
                      Pay using UPI, Card, or Net Banking.
                    </p>
                  </div>
                )}

              </div>

              {/* Pay Button */}
              <button
                className="w-full py-3 rounded-md bg-(--color-primary) text-(--color-white)  cursor-pointer
          hover:scale-[1.02] transition duration-300 shadow-sm"  onClick={(e) => handlePayment(e)}
              >
                Proceed to Pay
              </button>

            </div>

          </div>

        ) : (

          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 text-center">

            <img
              src={Images.Login}
              alt="login"
              className="w-60 md:w-80 mb-4"
            />

            <p className="text-gray-600">
              Please{" "}
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="text-(--color-primary) font-semibold underline"
              >
                login
              </Link>{" "}
              to access the payment page.
            </p>

          </div>

        )
      }

    </>
  )
}

export default Payment;