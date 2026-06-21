import { useEffect, useState } from "react";
import utilisateurService from "../services/utilisateurService";
import typeutilisateurService from "../services/typeutilisateurService";

const empty = { nom: "", prenom: "", email: "", login: "", motdepasse: "", telephone: "", statut: "ACTIF", id_typeutilisateur: "" };

export default function Utilisateurs() {
    const [users, setUsers] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [error, setError] = useState("");

    const load = () => {
        setLoading(true);
        Promise.all([utilisateurService.getAll(), typeutilisateurService.getAll()])
            .then(([u, t]) => {
                setUsers(u.data);
                setTypes(t.data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const openCreate = () => {
        setEditing(null);
        setForm({ ...empty, id_typeutilisateur: types[0]?.id_typeutilisateur || "" });
        setShowForm(true);
        setError("");
    };

    const openEdit = (u) => {
        setEditing(u);
        setForm({
            nom: u.nom, prenom: u.prenom, email: u.email, login: u.login,
            motdepasse: "", telephone: u.telephone || "", statut: u.statut || "ACTIF",
            id_typeutilisateur: u.typeutilisateur?.id_typeutilisateur || "",
        });
        setShowForm(true);
        setError("");
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const payload = { ...form, typeutilisateur: { id_typeutilisateur: Number(form.id_typeutilisateur) } };
            if (editing) {
                if (!payload.motdepasse) delete payload.motdepasse;
                await utilisateurService.update(editing.id_utilisateur, payload);
            } else {
                await utilisateurService.create(payload);
            }
            setShowForm(false);
            load();
        } catch {
            setError("Erreur : vérifiez que le login/email n'est pas déjà utilisé.");
        }
    };

    const handleDelete = async (u) => {
        if (!confirm(`Supprimer l'utilisateur ${u.prenom} ${u.nom} ?`)) return;
        try {
            await utilisateurService.remove(u.id_utilisateur);
            setUsers((prev) => prev.filter((x) => x.id_utilisateur !== u.id_utilisateur));
        } catch {
            alert("Suppression impossible (l'utilisateur possède peut-être des produits liés).");
        }
    };

    return (
        <div>
            <div className="section-head">
                <h2>Utilisateurs</h2>
                <button className="btn-grad" onClick={openCreate}>+ Nouvel utilisateur</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "1.5rem" }}>
                    <h3>{editing ? "Modifier l'utilisateur" : "Créer un utilisateur"}</h3>
                    {error && <div className="alert-error">{error}</div>}
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Nom</label>
                            <input className="input" name="nom" value={form.nom} onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Prénom</label>
                            <input className="input" name="prenom" value={form.prenom} onChange={handleChange} required />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Email</label>
                            <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Téléphone</label>
                            <input className="input" name="telephone" value={form.telephone} onChange={handleChange} />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Login</label>
                            <input className="input" name="login" value={form.login} onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">{editing ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}</label>
                            <input className="input" type="password" name="motdepasse" value={form.motdepasse} onChange={handleChange} required={!editing} />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Type de compte</label>
                            <select className="input" name="id_typeutilisateur" value={form.id_typeutilisateur} onChange={handleChange} required>
                                {types.map((t) => (
                                    <option key={t.id_typeutilisateur} value={t.id_typeutilisateur}>{t.nom_typeutilisateur}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Statut</label>
                            <select className="input" name="statut" value={form.statut} onChange={handleChange}>
                                <option value="ACTIF">Actif</option>
                                <option value="INACTIF">Inactif</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button className="btn-grad" type="submit">Enregistrer</button>
                        <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Annuler</button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="empty-state"><span className="spinner" /></div>
            ) : (
                <div className="card" style={{ padding: 0, overflowX: "auto" }}>
                    <table className="table-dark-custom">
                        <thead>
                            <tr>
                                <th>Nom</th><th>Login</th><th>Email</th><th>Type</th><th>Statut</th><th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id_utilisateur}>
                                    <td style={{ color: "var(--text-h)", fontWeight: 600 }}>{u.prenom} {u.nom}</td>
                                    <td>{u.login}</td>
                                    <td>{u.email}</td>
                                    <td><span className="badge badge-accent">{u.typeutilisateur?.nom_typeutilisateur || "—"}</span></td>
                                    <td><span className={"badge " + (u.statut === "ACTIF" ? "badge-success" : "badge-danger")}>{u.statut}</span></td>
                                    <td style={{ display: "flex", gap: 8 }}>
                                        <button className="btn-icon" onClick={() => openEdit(u)}>✏️</button>
                                        <button className="btn-danger" onClick={() => handleDelete(u)}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
