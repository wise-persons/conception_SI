import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function getRoleName(user) {
    return user?.typeutilisateur?.nom_typeutilisateur?.toUpperCase() || "";
}

export function roleHomePath(user) {
    const role = getRoleName(user);
    if (role.includes("ADMIN")) return "/admin";
    if (role.includes("VENDEUR")) return "/vendeur";
    return "/client";
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => authService.getCurrentUser());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Si un user est déjà stocké, on tente de le rafraîchir en tâche de fond
        if (user) {
            authService.refreshCurrentUser().then((u) => {
                if (u) setUser(u);
            }).catch(() => {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (login, password) => {
        setError("");
        setLoading(true);
        try {
            const u = await authService.login(login, password);
            if (!u) {
                throw new Error("Compte introuvable après connexion.");
            }
            setUser(u);
            return u;
        } catch (e) {
            const msg =
                e?.response?.status === 401 || e?.response?.status === 403
                    ? "Identifiant ou mot de passe incorrect."
                    : e?.message || "Erreur de connexion. Réessayez.";
            setError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading, error, setError }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
