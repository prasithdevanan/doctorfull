import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

function ProductorRouter({ children, adminOnly = false }) {
    const { aToken, dToken } = useContext(AdminContext);

    const isLoggedIn = !!aToken || !!dToken;

    if (!isLoggedIn) {
        localStorage.removeItem("aToken");
        localStorage.removeItem("dToken");
        localStorage.removeItem("dEmail");
        localStorage.removeItem("aEmail");
        localStorage.removeItem("id");
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !aToken) {
        localStorage.removeItem("aToken");
        localStorage.removeItem("dToken");
        localStorage.removeItem("dEmail");
        localStorage.removeItem("aEmail");
        localStorage.removeItem("id");
        console.warn("Access denied: Admins only");
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProductorRouter;