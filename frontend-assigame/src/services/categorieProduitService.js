import api from "./api";

const getAll = () =>
    api.get("/api/categorieproduit/list");

const create = (categorie) =>
    api.post("/api/categorieproduit/add", categorie);

const update = (id, categorie) =>
    api.put(`/api/categorieproduit/update/${id}`, categorie);

const remove = (id) =>
    api.delete(`/api/categorieproduit/delete/${id}`);

export default {
    getAll,
    create,
    update,
    remove,
};