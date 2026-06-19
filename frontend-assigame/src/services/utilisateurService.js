import api from "./api";

const getAll = () =>
    api.get("/api/utilisateur/list");

const create = (utilisateur) =>
    api.post("/api/utilisateur/add", utilisateur);

const update = (id, utilisateur) =>
    api.put(`/api/utilisateur/update/${id}`, utilisateur);

const remove = (id) =>
    api.delete(`/api/utilisateur/delete/${id}`);

export default {
    getAll,
    create,
    update,
    remove,
};