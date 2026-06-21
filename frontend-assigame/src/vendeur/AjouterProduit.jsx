import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import produitService from "../services/produitService";
import categorieProduitService from "../services/categorieProduitService";
import uploadService from "../services/uploadService";
import { resolveImageUrl } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AjouterProduit() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        nom_produit: "",
        description: "",
        prix: "",
        image: "",
        statut: "DISPONIBLE",
        idcategorie_produit: "",
    });

    useEffect(() => {
        categorieProduitService.getAll().then((res) => {
            setCategories(res.data);
            if (res.data.length) {
                setForm((f) => ({ ...f, idcategorie_produit: res.data[0].idcategorie_produit }));
            }
        }).catch(() => {});
    }, []);

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
            setError("Échec de l'envoi de l'image. Réessaie ou vérifie que le backend est démarré.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const payload = {
                nom_produit: form.nom_produit,
                description: form.description,
                prix: Number(form.prix),
                image: form.image,
                statut: form.statut,
                categorieProduit: { idcategorie_produit: Number(form.idcategorie_produit) },
                utilisateur: { id_utilisateur: user.id_utilisateur },
            };
            await produitService.create(payload);
            navigate("/vendeur/produits");
        } catch {
            setError("Impossible d'ajouter ce produit. Vérifiez les champs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 560 }}>
            <h2>Ajouter un produit</h2>
            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="card">
                <div className="form-group">
                    <label className="form-label">Nom du produit</label>
                    <input className="input" name="nom_produit" value={form.nom_produit} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="input" rows={4} name="description" value={form.description} onChange={handleChange} />
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Prix (FCFA)</label>
                        <input className="input" type="number" min="0" name="prix" value={form.prix} onChange={handleChange} required />
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
                            <option key={c.idcategorie_produit} value={c.idcategorie_produit}>
                                {c.nom_categorieproduit}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Photo du produit</label>
                    <input
                        className="input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ padding: ".5rem" }}
                    />
                    {uploading && (
                        <p style={{ marginTop: ".5rem", color: "var(--text-mute)", fontSize: ".85rem" }}>
                            <span className="spinner" style={{ width: 14, height: 14, marginRight: 6, verticalAlign: "middle" }} />
                            Envoi de l'image en cours...
                        </p>
                    )}
                    {form.image && !uploading && (
                        <div style={{ marginTop: ".7rem" }}>
                            <img
                                src={resolveImageUrl(form.image)}
                                alt="Aperçu"
                                style={{ width: 110, height: 110, objectFit: "cover", borderRadius: 10, border: "1px solid var(--border)" }}
                            />
                        </div>
                    )}
                </div>

                <button className="btn-grad" type="submit" disabled={loading || uploading}>
                    {loading ? <span className="spinner" /> : "Publier le produit"}
                </button>
            </form>
        </div>
    );
}
