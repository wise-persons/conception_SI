import { Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/cardItems";
import { useEffect, useState } from "react";
import produitService from "../services/produitService";

const items = [
    { to: "/vendeur", label: "Tableau de bord", icon: "🏠", end: true },
    { to: "/vendeur/produits", label: "Mes produits", icon: "📦" },
    { to: "/vendeur/ajouter", label: "Ajouter un produit", icon: "➕" },
];

function VendeurHome() {
    const { user } = useAuth();
    const [produits, setProduits] = useState([]);

    useEffect(() => {
        produitService.getAll().then((res) => {
            setProduits(res.data.filter((p) => p.utilisateur?.id_utilisateur === user?.id_utilisateur));
        }).catch(() => {});
    }, [user]);

    const disponibles = produits.filter((p) => p.statut === "DISPONIBLE").length;
    const valeurStock = produits.reduce((sum, p) => sum + (p.prix || 0), 0);

    return (
        <div>
            <h2>Bienvenue {user?.prenom} 👋</h2>
            <p style={{ color: "var(--text-mute)", marginBottom: "2rem" }}>
                Gérez vos annonces et suivez vos ventes sur AssiGame.
            </p>

            <div className="grid-stats">
                <StatCard icon="📦" value={produits.length} label="Produits publiés" />
                <StatCard icon="✅" value={disponibles} label="Produits disponibles" />
                <StatCard icon="💰" value={`${new Intl.NumberFormat("fr-FR").format(valeurStock)} FCFA`} label="Valeur du stock" />
            </div>

            <div className="card">
                <h3>Ajoutez un nouveau produit</h3>
                <p style={{ color: "var(--text-mute)" }}>
                    Publiez vos jeux, consoles ou accessoires en quelques clics.
                </p>
                <Link to="/vendeur/ajouter" className="btn-grad" style={{ textDecoration: "none", display: "inline-block" }}>
                    Publier une annonce
                </Link>
            </div>
        </div>
    );
}

export default function DashboardVendeur() {
    const location = useLocation();
    const isRoot = location.pathname === "/vendeur";

    return (
        <div className="dash-layout">
            <Sidebar title="Espace vendeur" items={items} />
            <div className="dash-content">{isRoot ? <VendeurHome /> : <Outlet />}</div>
        </div>
    );
}
