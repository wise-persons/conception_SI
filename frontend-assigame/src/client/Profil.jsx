import { useState } from "react";
import utilisateurService from "../services/utilisateurService";
import { useAuth } from "../context/AuthContext";

export default function Profil() {
    const { user, setUser } = useAuth();
    const [form, setForm] = useState({
        nom: user?.nom || "",
        prenom: user?.prenom || "",
        email: user?.email || "",
        telephone: user?.telephone || "",
        motdepasse: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);
        try {
            const payload = { ...user, ...form };
            if (!form.motdepasse) delete payload.motdepasse;
            const res = await utilisateurService.update(user.id_utilisateur, payload);
            const updated = { ...user, ...res.data };
            setUser(updated);
            localStorage.setItem("user", JSON.stringify(updated));
            setMessage("Profil mis à jour avec succès !");
            setForm((f) => ({ ...f, motdepasse: "" }));
        } catch {
            setError("Erreur lors de la mise à jour du profil.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 480 }}>
            <h2>Mon profil</h2>
            <p style={{ color: "var(--text-mute)", marginBottom: "1.5rem" }}>
                Identifiant : <strong style={{ color: "var(--text-h)" }}>{user?.login}</strong>
            </p>

            {message && <div className="alert-success">{message}</div>}
            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="card">
                <div style={{ display: "flex", gap: "1rem" }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Nom</label>
                        <input className="input" name="nom" value={form.nom} onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Prénom</label>
                        <input className="input" name="prenom" value={form.prenom} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input className="input" name="telephone" value={form.telephone} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">Nouveau mot de passe (optionnel)</label>
                    <input
                        className="input"
                        type="password"
                        name="motdepasse"
                        value={form.motdepasse}
                        onChange={handleChange}
                        placeholder="Laisser vide pour ne pas changer"
                    />
                </div>
                <button className="btn-grad" type="submit" disabled={loading}>
                    {loading ? <span className="spinner" /> : "Enregistrer"}
                </button>
            </form>
        </div>
    );
}
