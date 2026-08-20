import React, { useEffect, useContext, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../component/CreateContext';
import { Images } from '../assets/img';
import axios from 'axios';
import { toast } from 'react-toastify';


function Payment() {

  // useEffect(() => {
  //   if (!location.state?.fromBooking) {
  //     navigate('/doctor');
  //   }
  // }, []);


  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
      // optional: show modal instead of silent block
      alert("You cannot go back during payment");
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    }
  }, []);

  const { token, BackendUrl } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const height = window.innerHeight - 120; // Subtracting the height of the navbar (assuming it's 120px)
  const element = location.state ? location.state.element : false;
  const allElement = location.state ? location.state.allElement : false;
  const date = location.state ? location?.state?.selectDate : false;
  const time = location.state ? location?.state?.selectTime : false;
  const fees = location.state ? location?.state?.fees : false;
  const patientName = location.state ? location?.state?.patientName : "Name not found";
  const patientPhone = location.state ? location?.state?.patientPhone : "Phone not found";
  const patientEmail = location.state ? location?.state?.patientEmail : "Email not found";
  const appointmentId = location.state ? location?.state?.appointmentId : false;
  const [appCharge, setAppCharge] = useState(200);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("appointmentId", appointmentId);
  }, []);

  ///check the active button
  const [paymentMethod, setPaymentMethod] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  // const [orderId, setOrderId] = useState('');

  const amount = fees * 100 + appCharge * 100;
  const currency = "INR";
  const receiptId = "order_rcptid_11";

  //handle payment method
  const handlePayment = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (paymentMethod) {
      return alert("Please select the razorpay. Apple pay under development");
    }

    const res = await axios.post(`${BackendUrl}/api/admin/order`, { amount, currency, receipt: receiptId }, { headers: "Content-Type: application/json" });

    if (!res.data.success) {
      return console.log(res.data.message);
    }

    const order_id = res.data.order.id;
    const appointmentId = localStorage.getItem("appointmentId");
    console.log(appointmentId);


    const options = {
      "key": 'rzp_test_SgAnRohB2gqLpU', // Replace with your Razorpay key_id
      amount, // Amount is in currency subunits.
      currency,
      "name": 'Metix',
      "description": 'Test Transaction',
      "order_id": order_id, // This is the order_id created in the backend
      "handler": async function (response) {
        try {
          const body = { ...response, appointmentId };
          const validation = await axios.post(`${BackendUrl}/api/admin/order/verify`, body, { headers: "Content-Type: application/json" });
          console.log(validation);
          if (validation.data.success) {
            navigate(`/doctor/${location?.state?.element._id}/patientdetails/payment/success`, { state: { body, amount: amount, orderId: order_id, currency: currency, name: patientName, email: patientEmail, phone: patientPhone, fromBooking: true } });
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
          localStorage.removeItem("appointmentId");
        }
      },
      "prefill": {
        "name": patientName,
        "email": patientEmail,
        "contact": patientPhone
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
      <div className="h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-br from-violet-50 via-white to-blue-50">
        <div className="mx-auto h-full w-full max-w-7xl px-3 py-3 sm:px-4 md:px-5 lg:px-6">
          <div className="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-[0.85fr_1.15fr] lg:gap-4">

            {/* ================= LEFT : SUMMARY ================= */}
            <section className="min-h-0 overflow-y-auto rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur-xl no-scrollbar sm:p-5 lg:overflow-hidden">

              <div className="flex h-full min-h-0 flex-col">

                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-500">Appointment</p>
                    <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Summary</h1>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <i className="bi bi-check-circle-fill text-base"></i>
                  </div>
                </div>

                {/* Doctor */}
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-gradient-to-r from-violet-50 to-blue-50 p-3 sm:p-4">

                  <div className="relative shrink-0">
                    <img src={element.image} alt={element.name} className="h-16 w-16 rounded-xl object-cover sm:h-[72px] sm:w-[72px]" />

                    <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"></span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">{element.name}</h2>

                    <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">{element.speciality}</p>

                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-semibold text-emerald-700">
                      <i className="bi bi-circle-fill text-[5px]"></i>
                      Available
                    </span>
                  </div>

                </div>

                {/* Appointment Info */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <i className="bi bi-calendar-event text-sm"></i>
                    </div>

                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Date</p>

                    <p className="mt-1 truncate text-xs font-semibold text-slate-800 sm:text-sm">{date}</p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                      <i className="bi bi-clock text-sm"></i>
                    </div>

                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Time</p>

                    <p className="mt-1 truncate text-xs font-semibold text-slate-800 sm:text-sm">{time}</p>
                  </div>

                </div>

                {/* Location */}
                <div className="mt-3 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                    <i className="bi bi-geo-alt text-sm"></i>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Location</p>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
                      {element?.address?.address1}
                      {element?.address?.address2 && `, ${element?.address?.address2}`}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-auto pt-4">

                  <div className="rounded-2xl bg-slate-900 p-4 text-white sm:p-5">

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Consultation</span>
                      <span className="text-sm font-medium">₹ {element.fees}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Platform Charge</span>
                      <span className="text-sm font-medium">₹ {appCharge}</span>
                    </div>

                    <div className="my-3 border-t border-white/10"></div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Total</span>
                      <span className="text-2xl font-bold text-emerald-400">₹ {element.fees + appCharge}</span>
                    </div>

                  </div>

                </div>

              </div>

            </section>


            {/* ================= RIGHT : PAYMENT ================= */}
            <section className="min-h-0 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm no-scrollbar sm:p-5 md:p-6 lg:overflow-hidden">

              <div className="flex h-full min-h-0 flex-col">

                {/* Header */}
                <div className="shrink-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-500">Secure Checkout</p>

                  <div className="mt-1 flex items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">Choose Payment</h1>

                      <p className="mt-1 text-xs text-slate-500 sm:text-sm">Select your preferred payment method.</p>
                    </div>

                    <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:flex">
                      <i className="bi bi-shield-lock-fill"></i>
                    </div>
                  </div>
                </div>


                {/* Payment Methods */}
                <div className="mt-5 grid shrink-0 grid-cols-2 gap-2.5 sm:gap-3">

                  {/* Apple Pay */}
                  <button onClick={() => setPaymentMethod(true)} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 sm:p-4 ${paymentMethod ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}>

                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg sm:h-11 sm:w-11 ${paymentMethod ? "bg-[var(--color-primary)] text-white" : "bg-slate-100 text-slate-600"}`}>
                      <i className="bi bi-apple"></i>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900 sm:text-sm">Apple Pay</p>
                      <p className="mt-0.5 truncate text-[9px] text-slate-400 sm:text-[10px]">Fast & Secure</p>
                    </div>

                  </button>


                  {/* Razorpay */}
                  <button onClick={() => setPaymentMethod(false)} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 sm:p-4 ${!paymentMethod ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}>

                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg sm:h-11 sm:w-11 ${!paymentMethod ? "bg-[var(--color-primary)] text-white" : "bg-slate-100 text-slate-600"}`}>
                      <i className="bi bi-credit-card"></i>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900 sm:text-sm">Razorpay</p>
                      <p className="mt-0.5 truncate text-[9px] text-slate-400 sm:text-[10px]">UPI, Card & Net Banking</p>
                    </div>

                  </button>

                </div>


                {/* Payment Information */}
                <div className="mt-4 flex min-h-[170px] flex-1 items-center justify-center rounded-2xl border border-slate-100 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-5 text-center sm:min-h-[190px]">

                  {paymentMethod ? (

                    <div className="max-w-sm">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl text-white shadow-lg sm:h-16 sm:w-16 sm:text-3xl">
                        <i className="bi bi-apple"></i>
                      </div>

                      <h2 className="mt-4 text-lg font-bold text-slate-900 sm:text-xl">Apple Pay</h2>

                      <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                        Complete your payment securely using Apple Pay.
                      </p>
                    </div>

                  ) : (

                    <div className="max-w-sm">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-2xl text-white shadow-lg sm:h-16 sm:w-16 sm:text-3xl">
                        <i className="bi bi-credit-card"></i>
                      </div>

                      <h2 className="mt-4 text-lg font-bold text-slate-900 sm:text-xl">Razorpay</h2>

                      <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                        Pay securely using UPI, Debit/Credit Card or Net Banking.
                      </p>
                    </div>

                  )}

                </div>


                {/* Bottom Payment Area */}
                <div className="mt-4 shrink-0 rounded-2xl border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/5 p-3 sm:p-4">

                  <div className="flex items-center justify-between gap-4">

                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 sm:text-[10px]">Total Payable</p>

                      <p className="mt-0.5 text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
                        ₹ {element.fees + appCharge}
                      </p>
                    </div>

                    <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] sm:flex">
                      <i className="bi bi-shield-check text-lg"></i>
                    </div>

                  </div>

                </div>


                {/* Pay Button */}
                <button onClick={(e) => handlePayment(e)} className="mt-3 flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 sm:py-3.5 sm:text-base">
                  <i className="bi bi-lock-fill text-xs"></i>
                  {loading ? "Processing..." : `Pay ₹${element.fees + appCharge}`}
                  <i className="bi bi-arrow-right text-base"></i>
                </button>

                <p className="mt-2 shrink-0 text-center text-[9px] text-slate-400 sm:text-[10px]">
                  <i className="bi bi-shield-check mr-1"></i>
                  Your payment is securely processed.
                </p>

              </div>

            </section>

          </div>
        </div>
      </div>

    </>
  )
}

export default Payment;