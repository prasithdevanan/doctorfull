import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { Navigate } from "react-router-dom";

function ProductorRouter({ children, adminOnly = false }) {
    const { aToken, dToken } = useContext(AdminContext);

    if (aToken === null && dToken === null) {
        return null;
    }

    // 🚫 no token → go to login
    if (!aToken && !dToken) {
        return <Navigate to="/login" replace />;
    }

    // 🚫 not admin → block admin routes
    if (adminOnly && !aToken) {
        return <Navigate to="/" replace />;
    }

    return children;
}


export default ProductorRouter;