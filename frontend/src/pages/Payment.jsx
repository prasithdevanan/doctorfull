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
  const element = location.state ? location.state.element : false;
  const date = location.state ? location?.state?.selectDate : false;
  const time = location.state ? location?.state?.selectTime : false;
  const fees = location.state ? location?.state?.fees : false;
  const [appCharge, setAppCharge] = useState(200);

  ///check the active button
  const [paymentMethod, setPaymentMethod] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  // const [orderId, setOrderId] = useState('');

  const amount = fees * 100 + appCharge * 100;
  const currency = "INR";
  const receiptId = "order_rcptid_11";



  //handle payment method
  const handlePayment = async (e) => {
    e.preventDefault();
    if (paymentMethod) {
      return alert("Please select the razorpay. Apple pay under development");
    }

    const res = await axios.post(`${BackendUrl}/api/admin/order`, { amount, currency, receipt: receiptId }, { headers: "Content-Type: application/json" });

    if (!res.data.success) {
      return console.log(res.data.message);
    }

    const order_id = res.data.order.id;


    const options = {
      "key": 'rzp_test_SgAnRohB2gqLpU', // Replace with your Razorpay key_id
      amount, // Amount is in currency subunits.
      currency,
      "name": 'Metix',
      "description": 'Test Transaction',
      "order_id": order_id, // This is the order_id created in the backend
      "handler": async function (response) {
        try {
          const body = { ...response }
          const validation = await axios.post(`${BackendUrl}/api/admin/order/verify`, body, { headers: "Content-Type: application/json" });
          if (validation.data.success) {
            navigate(`/doctor/${location?.state?.element._id}/patientdetails/payment/success`, { state: { body, amount: amount, orderId: order_id, currency: currency, name: name, fromBooking: true } });
          }
        } catch (error) {
          console.log(error);
        }
      },
      "prefill": {
        "name": 'Alex',
        "email": 'alex@example.com',
        "contact": '9999999999'
      },
      "theme": {
        "color": "(--color-primary)"
      },

      model: {
        ondismiss: () => {
          console.log('Payment popup closed');
        }
      }
    };

    // open razorpay

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
      <div className="w-full min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 py-6 sm:py-10 px-3 sm:px-5">

        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-6 lg:gap-8 items-start">

          {/* LEFT SIDE */}
          <div className="w-full xl:w-[35%] xl:sticky xl:top-24">

            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-4 sm:p-6 flex flex-col gap-5 sm:gap-6">

              {/* Heading */}
              <div>

                <p className="text-sm text-gray-500">
                  Appointment Summary
                </p>

                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
                  Confirm & Pay
                </h1>

              </div>

              {/* Doctor Card */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-gradient-to-r from-violet-50 to-blue-50 p-4 rounded-2xl border border-gray-100">

                <div className="relative">

                  <img
                    src={element.image}
                    alt="doctor"
                    className="w-20 h-20 rounded-2xl object-cover"
                  />

                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>

                </div>

                <div className="flex-1 text-center sm:text-left">

                  <h2 className="font-semibold text-lg text-gray-800">
                    {element.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {element.speciality}
                  </p>

                  <div className="mt-2 inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                    Available Today
                  </div>

                </div>

              </div>

              {/* Date & Time */}
              <div className="flex items-start gap-4">

                <div className="min-w-12 w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <i className="bi bi-calendar4 text-blue-600 text-lg"></i>
                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Date & Time
                  </p>

                  <p className="text-sm sm:text-base text-gray-800 font-medium mt-1">
                    {date}, {time}
                  </p>

                </div>

              </div>

              {/* Location */}
              <div className="flex items-start gap-4">

                <div className="min-w-12 w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
                  <i className="bi bi-geo-alt text-violet-600 text-lg"></i>
                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Location
                  </p>

                  <p className="text-sm sm:text-base text-gray-700 mt-1 leading-relaxed break-words">
                    {element?.address?.address1}
                    <br />
                    {element?.address?.address2}
                  </p>

                </div>

              </div>

              {/* Fees */}
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Consultation Fee</span>

                  <span className="font-medium text-gray-800">
                    ₹ {element.fees}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">

                  <span>Platform Charge</span>

                  <span className="font-medium text-gray-800">
                    ₹ {appCharge}
                  </span>

                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between items-center">

                  <span className="font-semibold text-gray-900 text-sm sm:text-base">
                    Total Amount
                  </span>

                  <span className="text-2xl font-bold text-(--color-primary)">
                    ₹ {element.fees + appCharge}
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="w-full xl:w-[65%]">

            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-4 sm:p-6 lg:p-8 flex flex-col gap-6 sm:gap-8">

              {/* Header */}
              <div className="text-center">

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Payment
                </h1>

                <p className="text-sm sm:text-base text-gray-500 mt-2">
                  Choose your preferred payment method
                </p>

              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                {/* Apple Pay */}
                <button
                  onClick={() => setPaymentMethod(true)}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer

            ${paymentMethod
                      ? "border-(--color-primary) bg-(--color-primary)/10 shadow-xl shadow-blue-100/50"
                      : "border-gray-200 hover:border-(--color-primary) hover:bg-(--color-primary)/4"
                    }`}
                >

                  <div className="flex flex-col items-center gap-4">

                    <div className={`w-14 sm:w-16 h-14 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl

              ${paymentMethod
                        ? "bg-(--color-primary) text-white"
                        : "bg-gray-100 text-gray-600"
                      }`}>

                      <i className="bi bi-apple"></i>

                    </div>

                    <div>

                      <h2 className="font-semibold text-base sm:text-lg">
                        Apple Pay
                      </h2>

                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Fast & Secure Payment
                      </p>

                    </div>

                  </div>

                </button>

                {/* Razorpay */}
                <button
                  onClick={() => setPaymentMethod(false)}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer

            ${!paymentMethod
                      ? "border-(--color-primary) bg-(--color-primary)/10 shadow-xl shadow-blue-100/50"
                      : "border-gray-200 hover:border-violet-300 hover:bg-(--color-primary)/4"
                    }`}
                >

                  <div className="flex flex-col items-center gap-4">

                    <div className={`w-14 sm:w-16 h-14 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl

              ${!paymentMethod
                        ? "bg-(--color-primary) text-white"
                        : "bg-gray-100 text-gray-600"
                      }`}>

                      <i className="bi bi-credit-card"></i>

                    </div>

                    <div>

                      <h2 className="font-semibold text-base sm:text-lg">
                        Razorpay
                      </h2>

                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        UPI, Card & Net Banking
                      </p>

                    </div>

                  </div>

                </button>

              </div>

              {/* Payment Content */}
              <div className="bg-linear-(--color-primary-gradient)/20 rounded-3xl p-5 sm:p-8 flex flex-col items-center justify-center text-center min-h-[220px] border border-violet-100">

                {paymentMethod ? (

                  <>
                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl sm:text-4xl mb-5">
                      <i className="bi bi-apple"></i>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Apple Pay
                    </h2>

                    <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-md">
                      Complete your payment instantly using Apple Pay with enhanced security.
                    </p>
                  </>

                ) : (

                  <>
                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-3xl sm:text-4xl mb-5">
                      <i className="bi bi-credit-card"></i>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Razorpay
                    </h2>

                    <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-md">
                      Pay securely via UPI, Debit/Credit Card or Net Banking.
                    </p>
                  </>

                )}

              </div>

              {/* Total Card */}
              <div className="bg-[var(--color-primary)]/10 rounded-3xl p-5 sm:p-6 text-white">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-(--color-primary) text-sm">
                      Total Payable
                    </p>

                    <h1 className="text-3xl sm:text-4xl font-bold mt-1 text-(--color-primary)">
                      ₹ {element.fees + appCharge}
                    </h1>

                  </div>

                  <div className="min-w-14 w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-(--color-primary)/20 flex items-center justify-center">
                    <i className="bi bi-shield-check text-2xl sm:text-3xl text-(--color-primary)"></i>
                  </div>

                </div>

              </div>

              {/* Pay Button */}
              <button
                onClick={(e) => handlePayment(e)}
                className="w-full py-3 sm:py-4 rounded-2xl bg-linear-(--color-primary-gradient) text-white font-semibold text-base sm:text-lg hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-(--color-primary) cursor-pointer"
              >
                Proceed to Pay
              </button>

            </div>

          </div>

        </div>

      </div>

    </>
  )
}

export default Payment;