import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { Navigate } from "react-router-dom";


function ProductorRouter({ children }) {
    const { aToken } = useContext(AdminContext);
    
    if (aToken) {
        console.log(aToken)
        return children;
    } else {
        return <Navigate to="/login" />
    }
}

export default ProductorRouter;