import React, { use, useState } from 'react'

function ToggleTheme() {


    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (localStorage.theme === "dark" || !("theme" in localStorage) && systemDark) {
        document.documentElement.classList.add("dark");
        localStorage.theme = "dark";
    } else {
        document.documentElement.classList.remove("dark");
        localStorage.theme = "light";
    }
    const [BtnName, setBtnName] = useState(localStorage.theme === "dark" ? "dark" : "light");

    const toggleTheme = () => {

        if (localStorage.theme === "dark") {
            localStorage.theme = "light";
            document.documentElement.classList.remove("dark");
            setBtnName("light");
        } else {
            localStorage.theme = "dark";
            document.documentElement.classList.add("dark");
            setBtnName("dark");
        }

    };


    return (
        <button onClick={toggleTheme}>
            {BtnName}
        </button>
    );
}

export default ToggleTheme;