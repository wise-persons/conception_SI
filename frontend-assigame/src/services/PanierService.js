import api from "./api";

const getAll = () =>
    api.get("/api/panier/list");

const getByUtilisateur = (idUtilisateur) =>
    api.get(`/api/panier/utilisateur/${idUtilisateur}`);

const add = (
    idUtilisateur,
    idProduit,
    quantite = 1
) =>
    api.post(
        `/api/panier/add?idUtilisateur=${idUtilisateur}&idProduit=${idProduit}&quantite=${quantite}`
    );

const update = (id, panier) =>
    api.put(`/api/panier/update/${id}`, panier);

const remove = (id) =>
    api.delete(`/api/panier/delete/${id}`);

export default {
    getAll,
    getByUtilisateur,
    add,
    update,
    remove,
};