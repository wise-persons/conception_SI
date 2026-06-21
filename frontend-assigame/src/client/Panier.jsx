import { useEffect, useState } from "react";
import panierService from "../services/PanierService";
import { resolveImageUrl } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Panier() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        if (!user) return;
        setLoading(true);
        panierService
            .getByUtilisateur(user.id_utilisateur)
            .then((res) => setItems(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(load, [user]);

    const updateQuantite = async (item, quantite) => {
        if (quantite < 1) return;
        try {
            await panierService.update(item.id_panier, { ...item, quantite });
            setItems((prev) => prev.map((i) => (i.id_panier === item.id_panier ? { ...i, quantite } : i)));
        } catch {
            alert("Erreur lors de la mise à jour.");
        }
    };

    const removeItem = async (item) => {
        if (!confirm("Retirer ce produit du panier ?")) return;
        try {
            await panierService.remove(item.id_panier);
            setItems((prev) => prev.filter((i) => i.id_panier !== item.id_panier));
        } catch {
            alert("Erreur lors de la suppression.");
        }
    };

    const total = items.reduce((sum, i) => sum + (i.produit?.prix || 0) * (i.quantite || 1), 0);

    if (loading) return <div className="empty-state"><span className="spinner" /></div>;

    return (
        <div>
            <h2>Mon panier</h2>

            {items.length === 0 ? (
                <div className="empty-state">
                    Votre panier est vide.
                    <br />
                    <Link to="/catalogue">Découvrir le catalogue →</Link>
                </div>
            ) : (
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                        {items.map((item) => (
                            <div
                                key={item.id_panier}
                                className="card"
                                style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}
                            >
                                <img
                                    src={resolveImageUrl(item.produit?.image)}
                                    onError={(e) => (e.target.style.display = "none")}
                                    alt=""
                                    style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover", background: "var(--bg-soft)" }}
                                />
                                <div style={{ flex: 1, minWidth: 160 }}>
                                    <div style={{ fontWeight: 700, color: "var(--text-h)" }}>
                                        {item.produit?.nom_produit}
                                    </div>
                                    <div style={{ color: "var(--text-mute)", fontSize: ".85rem" }}>
                                        {new Intl.NumberFormat("fr-FR").format(item.produit?.prix || 0)} FCFA /unité
                                    </div>
                                    <span className="badge badge-accent" style={{ marginTop: 4 }}>{item.statut}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                                    <button className="btn-icon" onClick={() => updateQuantite(item, item.quantite - 1)}>-</button>
                                    <span style={{ minWidth: 24, textAlign: "center" }}>{item.quantite}</span>
                                    <button className="btn-icon" onClick={() => updateQuantite(item, item.quantite + 1)}>+</button>
                                </div>
                                <div style={{ fontWeight: 700, minWidth: 110, textAlign: "right", color: "var(--text-h)" }}>
                                    {new Intl.NumberFormat("fr-FR").format((item.produit?.prix || 0) * item.quantite)} FCFA
                                </div>
                                <button className="btn-danger" onClick={() => removeItem(item)}>Retirer</button>
                            </div>
                        ))}
                    </div>

                    <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ color: "var(--text-mute)", fontSize: ".85rem" }}>Total</div>
                            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-h)" }}>
                                {new Intl.NumberFormat("fr-FR").format(total)} FCFA
                            </div>
                        </div>
                        <button className="btn-grad" onClick={() => alert("Commande validée ! (démo)")}>
                            Valider la commande
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
