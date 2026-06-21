import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Catalogue from "../pages/Catalogue";
import ProduitDetails from "../pages/ProduitDetails";

import DashboardClient from "../client/DashboardClient";
import Panier from "../client/Panier";
import Profil from "../client/Profil";

import DashboardVendeur from "../vendeur/DashboardVendeur";
import AjouterProduit from "../vendeur/AjouterProduit";
import MesProduits from "../vendeur/MesProduits";
import ModifierProduit from "../vendeur/ModifierProduit";

import DashboardAdmin from "../admin/DashboardAdmin";
import Utilisateurs from "../admin/Utilisateurs";
import Produits from "../admin/Produits";
import CategorieProduits from "../admin/CategorieProduits";
import TypeUtilisateur from "../admin/TypeUtilisateur";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/produit/:id" element={<ProduitDetails />} />

            <Route
                path="/client"
                element={
                    <ProtectedRoute role="CLIENT">
                        <DashboardClient />
                    </ProtectedRoute>
                }
            >
                <Route path="panier" element={<Panier />} />
                <Route path="profil" element={<Profil />} />
            </Route>

            <Route
                path="/vendeur"
                element={
                    <ProtectedRoute role="VENDEUR">
                        <DashboardVendeur />
                    </ProtectedRoute>
                }
            >
                <Route path="produits" element={<MesProduits />} />
                <Route path="ajouter" element={<AjouterProduit />} />
                <Route path="modifier/:id" element={<ModifierProduit />} />
            </Route>

            <Route
                path="/admin"
                element={
                    <ProtectedRoute role="ADMIN">
                        <DashboardAdmin />
                    </ProtectedRoute>
                }
            >
                <Route path="utilisateurs" element={<Utilisateurs />} />
                <Route path="produits" element={<Produits />} />
                <Route path="categories" element={<CategorieProduits />} />
                <Route path="types" element={<TypeUtilisateur />} />
            </Route>

            <Route path="*" element={<Home />} />
        </Routes>
    );
}
