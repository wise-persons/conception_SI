package com.esgis2026.assigame.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.esgis2026.assigame.entity.Panier;
import com.esgis2026.assigame.entity.Produit;
import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.repository.PanierRepository;
import com.esgis2026.assigame.repository.ProduitRepository;
import com.esgis2026.assigame.repository.UtilisateurRepository;

@Service
public class PanierService {

    private final PanierRepository panierRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ProduitRepository produitRepository;

    public PanierService(PanierRepository panierRepository,
                         UtilisateurRepository utilisateurRepository,
                         ProduitRepository produitRepository) {
        this.panierRepository = panierRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.produitRepository = produitRepository;
    }

    public List<Panier> getAllPaniers() {
        return panierRepository.findAll();
    }

    public List<Panier> getPaniersByUtilisateur(Long idUtilisateur) {
        return panierRepository.findByUtilisateurId(idUtilisateur);
    }

    public Panier createPanier(Long idUtilisateur, Long idProduit, int quantite) {
        Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur not found with id " + idUtilisateur));

        Produit produit = produitRepository.findById(idProduit)
                .orElseThrow(() -> new RuntimeException("Produit not found with id " + idProduit));

        Panier panier = new Panier();
        panier.setUtilisateur(utilisateur);
        panier.setProduit(produit);
        panier.setQuantite(quantite);
        // statut et dateAjout sont initialisés par @PrePersist

        return panierRepository.save(panier);
    }

    public Panier updatePanier(Long idPanier, Panier details) {
        Panier panier = panierRepository.findById(idPanier)
                .orElseThrow(() -> new RuntimeException("Panier not found with id " + idPanier));

        panier.setQuantite(details.getQuantite());
        panier.setStatut(details.getStatut());

        return panierRepository.save(panier);
    }

    public void deletePanier(Long idPanier) {
        panierRepository.deleteById(idPanier);
    }
}