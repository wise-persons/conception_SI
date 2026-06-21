import { useEffect, useMemo, useState } from "react";
import produitService from "../services/produitService";
import categorieProduitService from "../services/categorieProduitService";
import panierService from "../services/PanierService";
import ProductCard from "../components/ProductCard";
import { useAuth, getRoleName } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Catalogue() {
    const [produits, setProduits] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categorie, setCategorie] = useState("");
    const [sort, setSort] = useState("recent");
    const [loadError, setLoadError] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([produitService.getAll(), categorieProduitService.getAll()])
            .then(([pRes, cRes]) => {
                setProduits(pRes.data);
                setCategories(cRes.data);
            })
            .catch((e) => {
                setLoadError(
                    !e?.response
                        ? "Impossible de joindre le serveur (http://localhost:8081). Vérifie que le backend est démarré."
                        : `Erreur ${e.response.status} lors du chargement des produits.`
                );
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        let list = produits.filter((p) => p.statut !== "SUPPRIME" && p.statut !== "INDISPONIBLE");
        if (search.trim()) {
            const s = search.toLowerCase();
            list = list.filter(
                (p) =>
                    p.nom_produit?.toLowerCase().includes(s) ||
                    p.description?.toLowerCase().includes(s)
            );
        }
        if (categorie) {
            list = list.filter((p) => String(p.categorieProduit?.idcategorie_produit) === String(categorie));
        }
        if (sort === "price_asc") list = [...list].sort((a, b) => a.prix - b.prix);
        if (sort === "price_desc") list = [...list].sort((a, b) => b.prix - a.prix);
        if (sort === "recent") list = [...list].sort((a, b) => (b.id_produit || 0) - (a.id_produit || 0));
        return list;
    }, [produits, search, categorie, sort]);

    const handleAdd = async (produit) => {
        if (!user) return navigate("/login");
        if (!getRoleName(user).includes("CLIENT")) {
            alert("Seuls les comptes clients peuvent ajouter au panier.");
            return;
        }
        try {
            await panierService.add(user.id_utilisateur, produit.id_produit, 1);
            alert("Produit ajouté au panier !");
        } catch {
            alert("Erreur lors de l'ajout au panier.");
        }
    };

    return (
        <div className="container section">
            <div className="section-head">
                <h2>Catalogue</h2>
                <span style={{ color: "var(--text-mute)" }}>{filtered.length} produit(s)</span>
            </div>

            <div className="toolbar">
                <input
                    className="input"
                    style={{ maxWidth: 280 }}
                    placeholder="Rechercher un produit..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className="input" style={{ maxWidth: 220 }} value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                    <option value="">Toutes les catégories</option>
                    {categories.map((c) => (
                        <option key={c.idcategorie_produit} value={c.idcategorie_produit}>
                            {c.nom_categorieproduit}
                        </option>
                    ))}
                </select>
                <select className="input" style={{ maxWidth: 200 }} value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="recent">Plus récents</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                </select>
            </div>

            {loadError && <div className="alert-error">{loadError}</div>}

            {loading ? (
                <div className="empty-state"><span className="spinner" /></div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">Aucun produit ne correspond à votre recherche.</div>
            ) : (
                <div className="grid-products">
                    {filtered.map((p) => (
                        <ProductCard key={p.id_produit} produit={p} onAddToPanier={handleAdd} />
                    ))}
                </div>
            )}
        </div>
    );
}
