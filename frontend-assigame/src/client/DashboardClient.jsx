import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/cardItems";
import { useEffect, useState } from "react";
import panierService from "../services/PanierService";
import { Link } from "react-router-dom";

const items = [
    { to: "/client", label: "Tableau de bord", icon: "🏠", end: true },
    { to: "/client/panier", label: "Mon panier", icon: "🛒" },
    { to: "/client/profil", label: "Mon profil", icon: "👤" },
];

function ClientHome() {
    const { user } = useAuth();
    const [panier, setPanier] = useState([]);

    useEffect(() => {
        if (user) {
            panierService
                .getByUtilisateur(user.id_utilisateur)
                .then((res) => setPanier(res.data))
                .catch(() => {});
        }
    }, [user]);

    const total = panier.reduce((sum, p) => sum + (p.produit?.prix || 0) * (p.quantite || 1), 0);

    return (
        <div>
            <h2>Bonjour {user?.prenom} 👋</h2>
            <p style={{ color: "var(--text-mute)", marginBottom: "2rem" }}>
                Voici un aperçu de votre activité sur AssiGame.
            </p>

            <div className="grid-stats">
                <StatCard icon="🛒" value={panier.length} label="Articles dans le panier" />
                <StatCard
                    icon="💰"
                    value={`${new Intl.NumberFormat("fr-FR").format(total)} FCFA`}
                    label="Valeur du panier"
                />
                <StatCard icon="🎮" value="∞" label="Jeux à découvrir" />
            </div>

            <div className="card">
                <h3>Continuez vos achats</h3>
                <p style={{ color: "var(--text-mute)" }}>
                    Parcourez le catalogue pour trouver vos prochains jeux et accessoires.
                </p>
                <Link to="/catalogue" className="btn-grad" style={{ textDecoration: "none", display: "inline-block" }}>
                    Voir le catalogue
                </Link>
            </div>
        </div>
    );
}

export default function DashboardClient() {
    const location = useLocation();
    const isRoot = location.pathname === "/client";

    return (
        <div className="dash-layout">
            <Sidebar title="Espace client" items={items} />
            <div className="dash-content">{isRoot ? <ClientHome /> : <Outlet />}</div>
        </div>
    );
}
