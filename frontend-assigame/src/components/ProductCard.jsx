import { Link } from "react-router-dom";
import { resolveImageUrl } from "../services/api";

const FALLBACK_IMG =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='#f4f9fd'/><text x='50%' y='50%' fill='#7c8a9a' font-size='18' text-anchor='middle' dominant-baseline='middle'>Pas d'image</text></svg>`
    );

export default function ProductCard({ produit, onAddToPanier, showActions = true }) {
    const prixFmt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(
        produit.prix || 0
    );

    return (
        <div className="product-card">
            <Link to={`/produit/${produit.id_produit}`} className="product-card-img-wrap">
                <img
                    src={resolveImageUrl(produit.image) || FALLBACK_IMG}
                    alt={produit.nom_produit}
                    onError={(e) => (e.target.src = FALLBACK_IMG)}
                />
            </Link>
            <div className="product-card-body">
                <span className="product-card-cat">
                    {produit.categorieProduit?.nom_categorieproduit || "Divers"}
                </span>
                <Link to={`/produit/${produit.id_produit}`} className="product-card-title" style={{ color: "var(--text-h)" }}>
                    {produit.nom_produit}
                </Link>
                <p className="product-card-desc">{produit.description || "Aucune description."}</p>
                <div className="product-card-footer">
                    <span className="product-card-price">{prixFmt} FCFA</span>
                    {showActions && onAddToPanier && (
                        <button className="btn-icon" onClick={() => onAddToPanier(produit)}>
                            🛒 Ajouter
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
