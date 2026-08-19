import React from "react";

function Footer() {
    return (
        <footer className="bg-slate-50 text-slate-600 mt-16 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-14">

                {/* Top Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">

                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-(--color-primary) flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                M
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                                Metix
                            </h2>
                        </div>

                        <p className="mt-4 text-sm sm:text-[15px] leading-6 text-slate-500 max-w-md">
                            Metix helps you manage healthcare easily — book appointments,
                            track records, and stay connected with trusted doctors.
                        </p>

                        <div className="mt-5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs sm:text-sm text-slate-500">
                                Trusted healthcare platform
                            </span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 mb-4">
                            Quick Links
                        </h3>

                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="/home" className="hover:text-(--color-primary) transition-colors duration-200">
                                    Home
                                </a>
                            </li>

                            <li>
                                <a href="/about" className="hover:text-(--color-primary) transition-colors duration-200">
                                    About
                                </a>
                            </li>

                            <li>
                                <a href="/doctor" className="hover:text-(--color-primary) transition-colors duration-200">
                                    Doctors
                                </a>
                            </li>

                            <li>
                                <a href="/contact" className="hover:text-(--color-primary) transition-colors duration-200">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 mb-4">
                            Contact
                        </h3>

                        <ul className="space-y-3 text-sm text-slate-500">
                            <li className="flex items-start gap-2">
                                <span className="text-(--color-primary)">✉</span>
                                <span>support@metix.com</span>
                            </li>

                            <li className="flex items-start gap-2">
                                <span className="text-(--color-primary)">☎</span>
                                <span>+91 98765 43210</span>
                            </li>

                            <li className="flex items-start gap-2">
                                <span className="text-(--color-primary)">●</span>
                                <span>India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-slate-200 mt-10 sm:mt-12 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-400">
                    <p>
                        © {new Date().getFullYear()} Metix. All rights reserved.
                    </p>

                    <div className="flex items-center gap-5">
                        <a href="/privacy" className="hover:text-slate-700 transition-colors duration-200">
                            Privacy Policy
                        </a>

                        <a href="/terms" className="hover:text-slate-700 transition-colors duration-200">
                            Terms
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;