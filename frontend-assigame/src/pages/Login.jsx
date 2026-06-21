import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, roleHomePath } from "../context/AuthContext";

export default function Login() {
    const { login, loading, error, setError } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ login: "", password: "" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const user = await login(form.login, form.password);
            navigate(roleHomePath(user));
        } catch {
            // erreur déjà gérée dans le contexte
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="card auth-card">
                <h2 style={{ textAlign: "center" }}>Connexion</h2>
                <p style={{ textAlign: "center", color: "var(--text-mute)", marginBottom: "1.5rem" }}>
                    Accédez à votre espace AssiGame.
                </p>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Identifiant</label>
                        <input
                            className="input"
                            name="login"
                            value={form.login}
                            onChange={handleChange}
                            placeholder="Votre login"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Mot de passe</label>
                        <input
                            className="input"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button className="btn-grad" type="submit" disabled={loading} style={{ width: "100%" }}>
                        {loading ? <span className="spinner" /> : "Se connecter"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "1.2rem", fontSize: ".9rem" }}>
                    Pas encore de compte ? <Link to="/register">Créer un compte</Link>
                </p>
            </div>
        </div>
    );
}
