import { useEffect, useState } from "react";
import typeutilisateurService from "../services/typeutilisateurService";

const empty = { nom_typeutilisateur: "", description_typeutilisateur: "" };

export default function TypeUtilisateur() {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [error, setError] = useState("");

    const load = () => {
        setLoading(true);
        typeutilisateurService.getAll().then((res) => setTypes(res.data)).catch(() => {}).finally(() => setLoading(false));
    };

    useEffect(load, []);

    const openCreate = () => { setEditing(null); setForm(empty); setShowForm(true); setError(""); };
    const openEdit = (t) => { setEditing(t); setForm({ nom_typeutilisateur: t.nom_typeutilisateur, description_typeutilisateur: t.description_typeutilisateur || "" }); setShowForm(true); setError(""); };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (editing) await typeutilisateurService.update(editing.id_typeutilisateur, form);
            else await typeutilisateurService.create(form);
            setShowForm(false);
            load();
        } catch {
            setError("Erreur lors de l'enregistrement.");
        }
    };

    const handleDelete = async (t) => {
        if (!confirm(`Supprimer le type "${t.nom_typeutilisateur}" ?`)) return;
        try {
            await typeutilisateurService.remove(t.id_typeutilisateur);
            setTypes((prev) => prev.filter((x) => x.id_typeutilisateur !== t.id_typeutilisateur));
        } catch {
            alert("Impossible de supprimer : des utilisateurs sont peut-être liés à ce type.");
        }
    };

    return (
        <div>
            <div className="section-head">
                <h2>Types de compte</h2>
                <button className="btn-grad" onClick={openCreate}>+ Nouveau type</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "1.5rem", maxWidth: 480 }}>
                    <h3>{editing ? "Modifier le type" : "Créer un type"}</h3>
                    {error && <div className="alert-error">{error}</div>}
                    <div className="form-group">
                        <label className="form-label">Nom (ex: CLIENT, VENDEUR, ADMIN)</label>
                        <input className="input" name="nom_typeutilisateur" value={form.nom_typeutilisateur} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="input" rows={3} name="description_typeutilisateur" value={form.description_typeutilisateur} onChange={handleChange} />
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
                        <thead><tr><th>Nom</th><th>Description</th><th></th></tr></thead>
                        <tbody>
                            {types.map((t) => (
                                <tr key={t.id_typeutilisateur}>
                                    <td style={{ color: "var(--text-h)", fontWeight: 600 }}>{t.nom_typeutilisateur}</td>
                                    <td>{t.description_typeutilisateur || "—"}</td>
                                    <td style={{ display: "flex", gap: 8 }}>
                                        <button className="btn-icon" onClick={() => openEdit(t)}>✏️</button>
                                        <button className="btn-danger" onClick={() => handleDelete(t)}>🗑️</button>
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
