import { useEffect, useState } from "react";
import categorieProduitService from "../services/categorieProduitService";

const empty = { nom_categorieproduit: "", description: "" };

export default function CategorieProduits() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [error, setError] = useState("");

    const load = () => {
        setLoading(true);
        categorieProduitService.getAll().then((res) => setCategories(res.data)).catch(() => {}).finally(() => setLoading(false));
    };

    useEffect(load, []);

    const openCreate = () => { setEditing(null); setForm(empty); setShowForm(true); setError(""); };
    const openEdit = (c) => { setEditing(c); setForm({ nom_categorieproduit: c.nom_categorieproduit, description: c.description || "" }); setShowForm(true); setError(""); };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (editing) await categorieProduitService.update(editing.idcategorie_produit, form);
            else await categorieProduitService.create(form);
            setShowForm(false);
            load();
        } catch {
            setError("Erreur : ce nom de catégorie existe peut-être déjà.");
        }
    };

    const handleDelete = async (c) => {
        if (!confirm(`Supprimer la catégorie "${c.nom_categorieproduit}" ?`)) return;
        try {
            await categorieProduitService.remove(c.idcategorie_produit);
            setCategories((prev) => prev.filter((x) => x.idcategorie_produit !== c.idcategorie_produit));
        } catch {
            alert("Impossible de supprimer : des produits sont peut-être liés à cette catégorie.");
        }
    };

    return (
        <div>
            <div className="section-head">
                <h2>Catégories de produits</h2>
                <button className="btn-grad" onClick={openCreate}>+ Nouvelle catégorie</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "1.5rem", maxWidth: 480 }}>
                    <h3>{editing ? "Modifier la catégorie" : "Créer une catégorie"}</h3>
                    {error && <div className="alert-error">{error}</div>}
                    <div className="form-group">
                        <label className="form-label">Nom</label>
                        <input className="input" name="nom_categorieproduit" value={form.nom_categorieproduit} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="input" rows={3} name="description" value={form.description} onChange={handleChange} />
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
                            {categories.map((c) => (
                                <tr key={c.idcategorie_produit}>
                                    <td style={{ color: "var(--text-h)", fontWeight: 600 }}>{c.nom_categorieproduit}</td>
                                    <td>{c.description || "—"}</td>
                                    <td style={{ display: "flex", gap: 8 }}>
                                        <button className="btn-icon" onClick={() => openEdit(c)}>✏️</button>
                                        <button className="btn-danger" onClick={() => handleDelete(c)}>🗑️</button>
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
