import { Navigate } from "react-router-dom";

/** Cart/checkout are disabled in showcase mode. */
export default function ShowcaseRedirect() {
    return <Navigate to="/products" replace />;
}
