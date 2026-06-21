import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import utilisateurService from "../services/utilisateurService";
import typeutilisateurService from "../services/typeutilisateurService";
import { useAuth, roleHomePath } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { login: doLogin } = useAuth();
    const [types, setTypes] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nom: "",
        prenom: "",
        email: "",
        login: "",
        motdepasse: "",
        telephone: "",
        id_typeutilisateur: "",
    });

    useEffect(() => {
        typeutilisateurService
            .getAll()
            .then((res) => {
                let list = res.data.filter(
                    (t) => !t.nom_typeutilisateur?.toUpperCase().includes("ADMIN")
                );
                // Si jamais aucun type CLIENT/VENDEUR n'existe encore en base,
                // on retombe sur la liste complète plutôt que d'afficher un select vide.
                if (list.length === 0) list = res.data;

                setTypes(list);
                if (list.length === 0) {
                    setError(
                        "Aucun type de compte n'existe encore en base de données. " +
                        "Un administrateur doit d'abord créer les types (CLIENT, VENDEUR, ADMIN) " +
                        "via /api/typeutilisateur/add ou la page Admin > Types de compte."
                    );
                    return;
                }

                const client = list.find((t) => t.nom_typeutilisateur?.toUpperCase().includes("CLIENT"));
                setForm((f) => ({ ...f, id_typeutilisateur: (client || list[0])?.id_typeutilisateur || "" }));
            })
            .catch((e) => {
                const status = e?.response?.status;
                if (!e?.response) {
                    setError(
                        "Impossible de joindre le serveur (http://localhost:8081). " +
                        "Vérifie que le backend Spring Boot est bien démarré."
                    );
                } else {
                    setError(
                        `Erreur ${status} lors du chargement des types de compte. ` +
                        "Regarde la console du backend pour le détail de l'erreur."
                    );
                }
            });
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const payload = {
                nom: form.nom,
                prenom: form.prenom,
                email: form.email,
                login: form.login,
                motdepasse: form.motdepasse,
                telephone: form.telephone,
                statut: "ACTIF",
                typeutilisateur: { id_typeutilisateur: Number(form.id_typeutilisateur) },
            };
            await utilisateurService.create(payload);
            setSuccess("Compte créé avec succès, connexion en cours...");
            const user = await doLogin(form.login, form.motdepasse);
            navigate(roleHomePath(user));
        } catch (e2) {
            setError(
                e2?.response?.data?.message ||
                    "Inscription impossible. Vérifiez vos informations (login/email déjà utilisé ?)."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="card auth-card" style={{ maxWidth: 520 }}>
                <h2 style={{ textAlign: "center" }}>Créer un compte</h2>
                <p style={{ textAlign: "center", color: "var(--text-mute)", marginBottom: "1.5rem" }}>
                    Rejoignez la communauté AssiGame.
                </p>

                {error && <div className="alert-error">{error}</div>}
                {success && <div className="alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
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

                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Identifiant (login)</label>
                            <input className="input" name="login" value={form.login} onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Téléphone</label>
                            <input className="input" name="telephone" value={form.telephone} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mot de passe</label>
                        <input
                            className="input"
                            type="password"
                            name="motdepasse"
                            value={form.motdepasse}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Je m'inscris en tant que</label>
                        <select
                            className="input"
                            name="id_typeutilisateur"
                            value={form.id_typeutilisateur}
                            onChange={handleChange}
                            required
                        >
                            {types.map((t) => (
                                <option key={t.id_typeutilisateur} value={t.id_typeutilisateur}>
                                    {t.nom_typeutilisateur}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="btn-grad" type="submit" disabled={loading} style={{ width: "100%" }}>
                        {loading ? <span className="spinner" /> : "Créer mon compte"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "1.2rem", fontSize: ".9rem" }}>
                    Déjà inscrit ? <Link to="/login">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}
