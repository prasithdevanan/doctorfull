import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

function PublicRoute({ children }) {
    const { aToken, dToken } = useContext(AdminContext);

    const isLoggedIn = !!aToken || !!dToken;

    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PublicRoute;