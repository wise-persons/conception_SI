import { resolveImageUrl } from "../services/api";

const FALLBACK_IMG =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect width='100%' height='100%' fill='#f4f9fd'/></svg>`
    );

export default function ProductTable({ produits, onEdit, onDelete, showSeller = false }) {
    if (!produits?.length) {
        return <div className="empty-state">Aucun produit pour le moment.</div>;
    }

    return (
        <div style={{ overflowX: "auto" }}>
            <table className="table-dark-custom">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        {showSeller && <th>Vendeur</th>}
                        <th>Prix</th>
                        <th>Statut</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {produits.map((p) => (
                        <tr key={p.id_produit}>
                            <td>
                                <img
                                    src={resolveImageUrl(p.image) || FALLBACK_IMG}
                                    onError={(e) => (e.target.src = FALLBACK_IMG)}
                                    alt=""
                                    style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }}
                                />
                            </td>
                            <td style={{ color: "var(--text-h)", fontWeight: 600 }}>{p.nom_produit}</td>
                            <td>{p.categorieProduit?.nom_categorieproduit || "—"}</td>
                            {showSeller && (
                                <td>
                                    {p.utilisateur ? `${p.utilisateur.prenom} ${p.utilisateur.nom}` : "—"}
                                </td>
                            )}
                            <td>{new Intl.NumberFormat("fr-FR").format(p.prix || 0)} FCFA</td>
                            <td>
                                <span
                                    className={
                                        "badge " +
                                        (p.statut === "DISPONIBLE" ? "badge-success" : "badge-warning")
                                    }
                                >
                                    {p.statut || "N/A"}
                                </span>
                            </td>
                            <td style={{ display: "flex", gap: 8 }}>
                                {onEdit && (
                                    <button className="btn-icon" onClick={() => onEdit(p)}>
                                        ✏️
                                    </button>
                                )}
                                {onDelete && (
                                    <button className="btn-danger" onClick={() => onDelete(p)}>
                                        🗑️
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
