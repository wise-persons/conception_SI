package com.esgis2026.assigame.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "panier")
public class Panier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_panier;

    @Column(nullable = false)
    private Integer quantite;

    @Column(name = "date_ajout", nullable = false)
    private LocalDateTime dateAjout;

    @Column(nullable = false, length = 20)
    private String statut;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur", nullable = false)
    private Utilisateur utilisateur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_produit", nullable = false)
    private Produit produit;

    @PrePersist
    public void prePersist() {
        if (dateAjout == null) dateAjout = LocalDateTime.now();
        if (statut == null)    statut    = "EN_COURS";
        if (quantite == null)  quantite  = 1;
    }

    // ── Getters ──────────────────────────────────────────
    public Long getId_panier()           { return id_panier; }
    public Integer getQuantite()         { return quantite; }
    public LocalDateTime getDateAjout()  { return dateAjout; }
    public String getStatut()            { return statut; }
    public Utilisateur getUtilisateur()  { return utilisateur; }
    public Produit getProduit()          { return produit; }

    // ── Setters ──────────────────────────────────────────
    public void setId_panier(Long id_panier)             { this.id_panier = id_panier; }
    public void setQuantite(Integer quantite)             { this.quantite = quantite; }
    public void setDateAjout(LocalDateTime dateAjout)     { this.dateAjout = dateAjout; }
    public void setStatut(String statut)                  { this.statut = statut; }
    public void setUtilisateur(Utilisateur utilisateur)   { this.utilisateur = utilisateur; }
    public void setProduit(Produit produit)               { this.produit = produit; }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id_panier == null) ? 0 : id_panier.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null) return false;
        if (getClass() != obj.getClass()) return false;
        Panier other = (Panier) obj;
        if (id_panier == null) {
            if (other.id_panier != null) return false;
        } else if (!id_panier.equals(other.id_panier)) return false;
        return true;
    }

    @Override
    public String toString() {
        return "Panier [id_panier=" + id_panier + ", quantite=" + quantite
                + ", dateAjout=" + dateAjout + ", statut=" + statut
                + ", utilisateur=" + (utilisateur != null ? utilisateur.getId_utilisateur() : null)
                + ", produit=" + (produit != null ? produit.getId_produit() : null) + "]";
    }
}
