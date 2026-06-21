import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import produitService from "../services/produitService";
import { resolveImageUrl } from "../services/api";
import panierService from "../services/PanierService";
import { useAuth, getRoleName } from "../context/AuthContext";

const FALLBACK_IMG =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='500' height='400'><rect width='100%' height='100%' fill='#f4f9fd'/><text x='50%' y='50%' fill='#7c8a9a' font-size='20' text-anchor='middle' dominant-baseline='middle'>Pas d'image</text></svg>`
    );

export default function ProduitDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [produit, setProduit] = useState(null);
    const [quantite, setQuantite] = useState(1);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        produitService
            .getAll()
            .then((res) => {
                const found = res.data.find((p) => String(p.id_produit) === String(id));
                setProduit(found || null);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleAdd = async () => {
        if (!user) return navigate("/login");
        if (!getRoleName(user).includes("CLIENT")) {
            setMessage("Seuls les comptes clients peuvent acheter.");
            return;
        }
        try {
            await panierService.add(user.id_utilisateur, produit.id_produit, quantite);
            setMessage("Produit ajouté au panier !");
        } catch {
            setMessage("Erreur lors de l'ajout au panier.");
        }
    };

    if (loading) return <div className="empty-state container"><span className="spinner" /></div>;
    if (!produit)
        return (
            <div className="empty-state container">
                Produit introuvable. <Link to="/catalogue">Retour au catalogue</Link>
            </div>
        );

    return (
        <div className="container section">
            <Link to="/catalogue">← Retour au catalogue</Link>
            <div className="produit-details-grid" style={{ marginTop: "1.5rem" }}>
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <img
                        src={resolveImageUrl(produit.image) || FALLBACK_IMG}
                        onError={(e) => (e.target.src = FALLBACK_IMG)}
                        alt={produit.nom_produit}
                        style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }}
                    />
                </div>

                <div>
                    <span className="badge badge-accent">
                        {produit.categorieProduit?.nom_categorieproduit || "Divers"}
                    </span>
                    <h1 style={{ fontSize: "2rem", margin: "0.8rem 0" }}>{produit.nom_produit}</h1>
                    <p style={{ color: "var(--text-mute)", marginBottom: "1.5rem" }}>
                        {produit.description || "Aucune description disponible."}
                    </p>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-h)", marginBottom: "1.5rem" }}>
                        {new Intl.NumberFormat("fr-FR").format(produit.prix || 0)} FCFA
                    </div>

                    {message && <div className="alert-success">{message}</div>}

                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
                        <input
                            type="number"
                            min="1"
                            className="input"
                            style={{ width: 90 }}
                            value={quantite}
                            onChange={(e) => setQuantite(Math.max(1, Number(e.target.value)))}
                        />
                        <button className="btn-grad" onClick={handleAdd}>
                            🛒 Ajouter au panier
                        </button>
                    </div>

                    <div className="card" style={{ fontSize: ".88rem" }}>
                        <p style={{ marginBottom: ".4rem" }}>
                            <strong style={{ color: "var(--text-h)" }}>Statut :</strong> {produit.statut}
                        </p>
                        <p style={{ marginBottom: 0 }}>
                            <strong style={{ color: "var(--text-h)" }}>Vendeur :</strong>{" "}
                            {produit.utilisateur ? `${produit.utilisateur.prenom} ${produit.utilisateur.nom}` : "N/A"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
