import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, getRoleName, roleHomePath } from "../context/AuthContext";
import Logo from "./Logo";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const role = getRoleName(user);

    return (
        <header className="navbar-root">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-brand">
                    <Logo height={34} />
                </Link>

                <button className="navbar-burger" onClick={() => setOpen((o) => !o)}>☰</button>

                <nav className={`navbar-links ${open ? "open" : ""}`}>
                    <Link to="/" onClick={() => setOpen(false)}>Accueil</Link>
                    <Link to="/catalogue" onClick={() => setOpen(false)}>Catalogue</Link>
                    {role.includes("CLIENT") && (
                        <Link to="/client/panier" onClick={() => setOpen(false)}>🛒 Panier</Link>
                    )}
                    {user ? (
                        <>
                            <Link to={roleHomePath(user)} className="navbar-space" onClick={() => setOpen(false)}>
                                Mon espace
                            </Link>
                            <button className="btn-outline" onClick={handleLogout}>Déconnexion</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-outline navbar-btn" onClick={() => setOpen(false)}>
                                Connexion
                            </Link>
                            <Link to="/register" className="btn-grad navbar-btn" onClick={() => setOpen(false)}>
                                S'inscrire
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
