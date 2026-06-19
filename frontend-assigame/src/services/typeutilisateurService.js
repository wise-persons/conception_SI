import api from "./api";

const getAll = () =>
    api.get("/api/typeutilisateur/list");

const create = (type) =>
    api.post("/api/typeutilisateur/add", type);

const update = (id, type) =>
    api.put(`/api/typeutilisateur/update/${id}`, type);

const remove = (id) =>
    api.delete(`/api/typeutilisateur/delete/${id}`);

export default {
    getAll,
    create,
    update,
    remove,
};