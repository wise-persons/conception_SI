import api from "./api";

const getAll = () => api.get("/api/produit/list");

const create = (produit) =>
    api.post("/api/produit/add", produit);

const update = (id, produit) =>
    api.put(`/api/produit/update/${id}`, produit);

const remove = (id) =>
    api.delete(`/api/produit/delete/${id}`);

export default {
    getAll,
    create,
    update,
    remove,
};