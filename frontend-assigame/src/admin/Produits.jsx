import { useEffect, useState } from "react";
import produitService from "../services/produitService";
import { resolveImageUrl } from "../services/api";
import categorieProduitService from "../services/categorieProduitService";
import uploadService from "../services/uploadService";
import ProductTable from "../components/ProductTable";

const empty = { nom_produit: "", description: "", prix: "", image: "", statut: "DISPONIBLE", idcategorie_produit: "" };

export default function Produits() {
    const [produits, setProduits] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);

    const load = () => {
        setLoading(true);
        Promise.all([produitService.getAll(), categorieProduitService.getAll()])
            .then(([p, c]) => {
                setProduits(p.data);
                setCategories(c.data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const openEdit = (p) => {
        setEditing(p);
        setForm({
            nom_produit: p.nom_produit, description: p.description || "", prix: p.prix,
            image: p.image || "", statut: p.statut, idcategorie_produit: p.categorieProduit?.idcategorie_produit || "",
        });
        setShowForm(true);
        setError("");
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError("");
        setUploading(true);
        try {
            const res = await uploadService.uploadImage(file);
            setForm((f) => ({ ...f, image: res.data.url }));
        } catch {
            setError("Échec de l'envoi de l'image.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const payload = {
                ...form,
                prix: Number(form.prix),
                categorieProduit: { idcategorie_produit: Number(form.idcategorie_produit) },
                utilisateur: { id_utilisateur: editing?.utilisateur?.id_utilisateur },
            };
            await produitService.update(editing.id_produit, payload);
            setShowForm(false);
            load();
        } catch {
            setError("Erreur lors de la mise à jour du produit.");
        }
    };

    const handleDelete = async (p) => {
        if (!confirm(`Supprimer "${p.nom_produit}" ?`)) return;
        try {
            await produitService.remove(p.id_produit);
            setProduits((prev) => prev.filter((x) => x.id_produit !== p.id_produit));
        } catch {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div>
            <div className="section-head">
                <h2>Produits ({produits.length})</h2>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "1.5rem" }}>
                    <h3>Modifier le produit</h3>
                    {error && <div className="alert-error">{error}</div>}
                    <div className="form-group">
                        <label className="form-label">Nom</label>
                        <input className="input" name="nom_produit" value={form.nom_produit} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="input" rows={3} name="description" value={form.description} onChange={handleChange} />
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Prix</label>
                            <input className="input" type="number" name="prix" value={form.prix} onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Statut</label>
                            <select className="input" name="statut" value={form.statut} onChange={handleChange}>
                                <option value="DISPONIBLE">Disponible</option>
                                <option value="INDISPONIBLE">Indisponible</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Catégorie</label>
                        <select className="input" name="idcategorie_produit" value={form.idcategorie_produit} onChange={handleChange} required>
                            {categories.map((c) => (
                                <option key={c.idcategorie_produit} value={c.idcategorie_produit}>{c.nom_categorieproduit}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Photo du produit</label>
                        <input className="input" type="file" accept="image/*" onChange={handleFileChange} style={{ padding: ".5rem" }} />
                        {uploading && <p style={{ marginTop: ".5rem", color: "var(--text-mute)", fontSize: ".85rem" }}>Envoi en cours...</p>}
                        {form.image && !uploading && (
                            <img
                                src={resolveImageUrl(form.image)}
                                alt="Aperçu"
                                style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 10, border: "1px solid var(--border)", marginTop: ".6rem" }}
                            />
                        )}
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
                <div className="card" style={{ padding: 0 }}>
                    <ProductTable produits={produits} onEdit={openEdit} onDelete={handleDelete} showSeller />
                </div>
            )}
        </div>
    );
}
