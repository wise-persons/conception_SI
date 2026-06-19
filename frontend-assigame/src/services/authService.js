import api from "./api";

const login = async (login, password) => {
    const response = await api.post("/api/auth/login", {
        login,
        password,
    });

    const token = response.data;

    localStorage.setItem("token", token);

    return token;
};

const logout = () => {
    localStorage.removeItem("token");
};

export default {
    login,
    logout,
};