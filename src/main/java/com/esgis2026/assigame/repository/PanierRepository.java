package com.esgis2026.assigame.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.esgis2026.assigame.entity.Panier;

@Repository
public interface PanierRepository extends JpaRepository<Panier, Long> {

    // Récupérer tous les paniers d'un utilisateur
    @Query("SELECT p FROM Panier p WHERE p.utilisateur.id_utilisateur = :idUtilisateur")
    List<Panier> findByUtilisateurId(@Param("idUtilisateur") Long idUtilisateur);

    // Récupérer les paniers d'un utilisateur filtrés par statut
    @Query("SELECT p FROM Panier p WHERE p.utilisateur.id_utilisateur = :idUtilisateur AND p.statut = :statut")
    List<Panier> findByUtilisateurIdAndStatut(@Param("idUtilisateur") Long idUtilisateur, @Param("statut") String statut);
}