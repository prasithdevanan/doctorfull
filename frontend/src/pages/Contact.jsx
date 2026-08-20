import React, { useState } from "react";
import { toast } from "react-toastify";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields");
      return;
    }

    // API call can go here
    console.log(form);

    toast.success("Message sent successfully");

    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="h-[calc(100vh-72px)] bg-slate-50 px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white border border-slate-200 rounded-3xl shadow-[0_10px_40px_rgba(15,23,42,0.06)] overflow-hidden">
        <div className="grid md:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="relative bg-gradient-to-br from-(--color-primary)/10 via-white to-slate-50 p-7 sm:p-10 lg:p-12">
            <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-(--color-primary)/10 blur-2xl"></div>

            <div className="relative flex flex-col justify-center h-full">

              <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-(--color-primary)/10 text-(--color-primary) text-xs font-semibold mb-5">
                <i className="bi bi-chat-dots-fill"></i>
                Get in touch
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Let's talk about
                <span className="block text-(--color-primary)">your healthcare needs.</span>
              </h1>

              <p className="mt-4 max-w-md text-sm sm:text-base leading-7 text-slate-500">
                Have questions, feedback, or need assistance? Our team is here to help you with anything you need.
              </p>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center">
                    <i className="bi bi-envelope-fill"></i>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">Email</p>
                    <a href="mailto:support@example.com" className="text-sm font-semibold text-slate-800 hover:text-(--color-primary) transition-colors">support@example.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center">
                    <i className="bi bi-telephone-fill"></i>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">Phone</p>
                    <p className="text-sm font-semibold text-slate-800">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">Location</p>
                    <p className="text-sm font-semibold text-slate-800">Chennai, India</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-7 sm:p-10 lg:p-12">

            {submitted ? (
              <div className="h-full min-h-[420px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                  <i className="bi bi-check-lg text-3xl"></i>
                </div>

                <h2 className="text-2xl font-bold text-slate-900">Message Sent!</h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Thanks for reaching out. Our team has received your message and will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="mb-7">
                  <h2 className="text-2xl font-bold text-slate-900">Send us a message</h2>
                  <p className="mt-1.5 text-sm text-slate-500">Fill out the form and we'll get back to you shortly.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>

                  <div className="relative">
                    <i className="bi bi-person absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>

                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/10" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>

                  <div className="relative">
                    <i className="bi bi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>

                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/10" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>

                  <div className="relative">
                    <i className="bi bi-chat-left-text absolute left-4 top-4 text-slate-400"></i>

                    <textarea name="message" rows="5" value={form.message} onChange={handleChange} placeholder="How can we help you?" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none transition-all focus:bg-white focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/10"></textarea>
                  </div>
                </div>

                <button type="submit" className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-(--color-primary) text-white text-sm font-semibold shadow-sm hover:opacity-90 active:scale-[0.99] transition-all duration-200 cursor-pointer">
                  <span>Send Message</span>
                  <i className="bi bi-arrow-right"></i>
                </button>

              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;