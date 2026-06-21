import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/cardItems";
import { useEffect, useState } from "react";
import utilisateurService from "../services/utilisateurService";
import produitService from "../services/produitService";
import categorieProduitService from "../services/categorieProduitService";
import typeutilisateurService from "../services/typeutilisateurService";

const items = [
    { to: "/admin", label: "Tableau de bord", icon: "🏠", end: true },
    { to: "/admin/utilisateurs", label: "Utilisateurs", icon: "👥" },
    { to: "/admin/produits", label: "Produits", icon: "📦" },
    { to: "/admin/categories", label: "Catégories", icon: "🏷️" },
    { to: "/admin/types", label: "Types de compte", icon: "🛡️" },
];

function AdminHome() {
    const [stats, setStats] = useState({ users: 0, produits: 0, categories: 0, types: 0 });

    useEffect(() => {
        Promise.all([
            utilisateurService.getAll(),
            produitService.getAll(),
            categorieProduitService.getAll(),
            typeutilisateurService.getAll(),
        ]).then(([u, p, c, t]) => {
            setStats({ users: u.data.length, produits: p.data.length, categories: c.data.length, types: t.data.length });
        }).catch(() => {});
    }, []);

    return (
        <div>
            <h2>Vue d'ensemble</h2>
            <p style={{ color: "var(--text-mute)", marginBottom: "2rem" }}>
                Statistiques globales de la plateforme AssiGame.
            </p>
            <div className="grid-stats">
                <StatCard icon="👥" value={stats.users} label="Utilisateurs inscrits" />
                <StatCard icon="📦" value={stats.produits} label="Produits publiés" />
                <StatCard icon="🏷️" value={stats.categories} label="Catégories" />
                <StatCard icon="🛡️" value={stats.types} label="Types de compte" />
            </div>
        </div>
    );
}

export default function DashboardAdmin() {
    const location = useLocation();
    const isRoot = location.pathname === "/admin";

    return (
        <div className="dash-layout">
            <Sidebar title="Espace admin" items={items} />
            <div className="dash-content">{isRoot ? <AdminHome /> : <Outlet />}</div>
        </div>
    );
}
