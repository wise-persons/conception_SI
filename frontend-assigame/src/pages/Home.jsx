import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import produitService from "../services/produitService";
import panierService from "../services/PanierService";
import ProductCard from "../components/ProductCard";
import { useAuth, getRoleName } from "../context/AuthContext";

export default function Home() {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        produitService
            .getAll()
            .then((res) => setProduits(res.data.slice(-8).reverse()))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleAdd = async (produit) => {
        if (!user) return navigate("/login");
        if (!getRoleName(user).includes("CLIENT")) return;
        try {
            await panierService.add(user.id_utilisateur, produit.id_produit, 1);
            alert("Produit ajouté au panier !");
        } catch {
            alert("Impossible d'ajouter ce produit au panier.");
        }
    };

    return (
        <div>
            <section className="hero-section">
                <div className="hero-glow" />
                <div className="container" style={{ position: "relative" }}>
                    <span className="hero-badge">🎮 La marketplace gaming #1 au Togo</span>
                    <h1 className="hero-title">
                        Achetez et vendez vos jeux, <br />consoles &amp; accessoires gaming
                    </h1>
                    <p className="hero-sub">
                        AssiGame connecte joueurs et vendeurs : trouvez vos pépites
                        d'occasion ou neuves, et donnez une seconde vie à votre setup.
                    </p>
                    <div className="hero-actions">
                        <Link to="/catalogue" className="btn-grad" style={{ textDecoration: "none" }}>
                            Explorer le catalogue
                        </Link>
                        <Link to="/register" className="btn-outline" style={{ textDecoration: "none" }}>
                            Devenir vendeur
                        </Link>
                    </div>
                </div>
            </section>

            <section className="section container">
                <div className="section-head">
                    <h2>Nouveautés</h2>
                    <Link to="/catalogue">Voir tout le catalogue →</Link>
                </div>

                {loading ? (
                    <div className="empty-state"><span className="spinner" /></div>
                ) : produits.length === 0 ? (
                    <div className="empty-state">Aucun produit disponible pour l'instant.</div>
                ) : (
                    <div className="grid-products">
                        {produits.map((p) => (
                            <ProductCard key={p.id_produit} produit={p} onAddToPanier={handleAdd} />
                        ))}
                    </div>
                )}
            </section>

            <section className="section container">
                <div className="grid-stats">
                    <div className="card" style={{ textAlign: "center" }}>
                        <h3>🚀 Rapide</h3>
                        <p style={{ color: "var(--text-mute)" }}>Publiez vos annonces en quelques secondes.</p>
                    </div>
                    <div className="card" style={{ textAlign: "center" }}>
                        <h3>🔒 Sécurisé</h3>
                        <p style={{ color: "var(--text-mute)" }}>Authentification et gestion des comptes sécurisées.</p>
                    </div>
                    <div className="card" style={{ textAlign: "center" }}>
                        <h3>🕹️ Communautaire</h3>
                        <p style={{ color: "var(--text-mute)" }}>Une marketplace pensée pour les gamers, par des gamers.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
