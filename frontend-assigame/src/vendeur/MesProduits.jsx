import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import produitService from "../services/produitService";
import { useAuth } from "../context/AuthContext";
import ProductTable from "../components/ProductTable";

export default function MesProduits() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        produitService
            .getAll()
            .then((res) => setProduits(res.data.filter((p) => p.utilisateur?.id_utilisateur === user?.id_utilisateur)))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(load, [user]);

    const handleDelete = async (produit) => {
        if (!confirm(`Supprimer "${produit.nom_produit}" ?`)) return;
        try {
            await produitService.remove(produit.id_produit);
            setProduits((prev) => prev.filter((p) => p.id_produit !== produit.id_produit));
        } catch {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div>
            <div className="section-head">
                <h2>Mes produits</h2>
                <button className="btn-grad" onClick={() => navigate("/vendeur/ajouter")}>+ Ajouter un produit</button>
            </div>

            {loading ? (
                <div className="empty-state"><span className="spinner" /></div>
            ) : (
                <div className="card" style={{ padding: 0 }}>
                    <ProductTable
                        produits={produits}
                        onEdit={(p) => navigate(`/vendeur/modifier/${p.id_produit}`)}
                        onDelete={handleDelete}
                    />
                </div>
            )}
        </div>
    );
}
