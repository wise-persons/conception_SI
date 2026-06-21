import { Navigate } from "react-router-dom";
import { useAuth, getRoleName } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (role && !getRoleName(user).includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
