import api from "./api";

function parseJwt(token) {
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
                .join("")
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
}

const login = async (login, password) => {
    const response = await api.post("/api/auth/login", {
        login,
        password,
    });

    const token = response.data;
    localStorage.setItem("token", token);

    // Le backend ne renvoie que le token : on retrouve l'utilisateur
    // correspondant au login (champ "sub" du JWT) via la liste des utilisateurs.
    const payload = parseJwt(token);
    const usersRes = await api.get("/api/utilisateur/list");
    const user = usersRes.data.find((u) => u.login === payload?.sub);

    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    }

    return user;
};

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
};

const getToken = () => localStorage.getItem("token");

const refreshCurrentUser = async () => {
    const current = getCurrentUser();
    if (!current) return null;
    const usersRes = await api.get("/api/utilisateur/list");
    const user = usersRes.data.find((u) => u.id_utilisateur === current.id_utilisateur);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    return user;
};

export default {
    login,
    logout,
    getCurrentUser,
    getToken,
    refreshCurrentUser,
};
