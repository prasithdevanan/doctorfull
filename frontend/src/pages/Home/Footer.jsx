import React from "react";

function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-700 mt-12 ">
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between gap-10">

                    {/* Brand */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Metix</h2>
                        <p className="mt-3 text-sm max-w-sm text-gray-600">
                            Metix helps you manage healthcare easily — book appointments,
                            track records, and stay connected with doctors.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-gray-900 font-semibold mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-gray-900 cursor-pointer transition">Home</li>
                            <li className="hover:text-gray-900 cursor-pointer transition">About</li>
                            <li className="hover:text-gray-900 cursor-pointer transition">Doctors</li>
                            <li className="hover:text-gray-900 cursor-pointer transition">Contact</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-gray-900 font-semibold mb-3">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>Email: support@metix.com</li>
                            <li>Phone: +91 98765 43210</li>
                            <li>Location: India</li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-300 mt-10 pt-5 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Metix. All rights reserved.
                </div>

            </div>
        </footer>
    );
}

export default Footer;