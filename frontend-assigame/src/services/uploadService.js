import api from "./api";

/**
 * Envoie un fichier image au backend, qui le stocke physiquement et
 * renvoie son URL publique (ex: "/uploads/abc123.png").
 * Cette URL est ensuite stockée dans le champ "image" du produit.
 */
const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/api/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export default { uploadImage };
