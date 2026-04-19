import React, { useState } from "react";

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
      alert("Please fill all fields");
      return;
    }

    // API call can go here
    console.log(form);

    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gray-50 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 bg-white p-6 md:p-10 rounded-xl shadow-md">


        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Contact Us
          </h1>

          <p className="text-gray-600">
            Have questions or need help? Feel free to reach out to us anytime.
          </p>

          <div className="space-y-3 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <i className="bi bi-envelope-fill text-[var(--color-primary)]"></i>
              Email:
              <a
                className="text-[var(--color-primary)] hover:underline"
                href="mailto:support@example.com"
              >
                support@example.com
              </a>
            </p>

            <p className="flex items-center gap-2">
              <i className="bi bi-telephone-fill text-[var(--color-primary)]"></i>
              Phone:
              <span className="text-[var(--color-primary)]">
                +91 98765 43210
              </span>
            </p>

            <p className="flex items-center gap-2">
              <i className="bi bi-geo-alt-fill text-[var(--color-primary)]"></i>
              Location: Chennai, India
            </p>
          </div>
        </div>


        <div>
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-xl font-semibold text-green-600 mb-2">
                Message Sent!
              </h2>
              <p className="text-gray-600">
                We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                  placeholder="Your email"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                  placeholder="Write your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-(--color-primary) text-white py-2 rounded-md hover:opacity-90 transition"
              >
                Send Message
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default Contact;