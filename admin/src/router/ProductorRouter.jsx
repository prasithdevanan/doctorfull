import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import {  useNavigate } from "react-router-dom";


function ProductorRouter({ children, adminOnly = false }) {
    const { aToken, dToken } = useContext(AdminContext);
    const navigate = useNavigate();

    //both token unavialble to navigate to login screen
    if (!aToken && !dToken) {
        return navigate("/login");
    }


    //check the admin only for add doctor
    if (adminOnly && !aToken) {
        return navigate('/dashboard');
    }


    return children;
}

export default ProductorRouter;