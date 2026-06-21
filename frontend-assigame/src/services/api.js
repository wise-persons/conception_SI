import axios from "axios";

const BASE_URL = "http://localhost:8081";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

/**
 * Les images uploadées sont stockées par le backend et renvoyées sous forme
 * d'URL relative (ex: "/uploads/abc.png"). Comme le frontend et le backend
 * tournent sur des ports différents, il faut préfixer ces URL relatives par
 * l'adresse du backend pour que l'image s'affiche. Si l'utilisateur a saisi
 * une URL externe complète (http://...), on la laisse telle quelle.
 */
export const resolveImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) {
        return image;
    }
    if (image.startsWith("/")) {
        return BASE_URL + image;
    }
    return image;
};

export default api;