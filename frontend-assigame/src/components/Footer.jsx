import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="footer-root">
            <div className="container footer-grid">
                <div className="footer-col">
                    <span style={{ display: "inline-block", marginBottom: ".8rem" }}>
                        <Logo height={30} />
                    </span>
                    <p style={{ maxWidth: 260, fontSize: ".88rem" }}>
                        La marketplace dédiée aux gamers : jeux, consoles, accessoires
                        et bons plans entre passionnés.
                    </p>
                </div>
                <div className="footer-col">
                    <h4>Navigation</h4>
                    <Link to="/">Accueil</Link>
                    <Link to="/catalogue">Catalogue</Link>
                    <Link to="/login">Connexion</Link>
                    <Link to="/register">Inscription</Link>
                </div>
                <div className="footer-col">
                    <h4>Vendeurs</h4>
                    <Link to="/vendeur">Espace vendeur</Link>
                    <Link to="/register">Devenir vendeur</Link>
                </div>
                <div className="footer-col">
                    <h4>Contact</h4>
                    <a href="mailto:contact@assigame.com">contact@assigame.com</a>
                    <a href="tel:+22890000000">+228 90 00 00 00</a>
                </div>
            </div>
            <div className="container footer-bottom">
                © {new Date().getFullYear()} AssiGame — Projet ESGIS 2026. Tous droits réservés.
            </div>
        </footer>
    );
}
