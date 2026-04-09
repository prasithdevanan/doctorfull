import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { Navigate, useNavigate } from "react-router-dom";


function ProductorRouter({ children, adminOnly = false }) {
    const { aToken, dToken } = useContext(AdminContext);

    //both token unavialble to navigate to login screen
    if (!aToken && !dToken) {
        return <Navigate to="/login" />;
    }


    //check the admin only for add doctor
    if (adminOnly && !aToken) {
        return <Navigate to="/dashboard" />;
    }


    return children;
}

export default ProductorRouter;