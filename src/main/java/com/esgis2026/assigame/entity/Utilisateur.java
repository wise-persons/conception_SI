package com.esgis2026.assigame.entity;


import java.time.LocalDateTime;
import jakarta.persistence.PrePersist;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "utilisateur")

public class Utilisateur {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id_utilisateur;

   @Column(nullable = false, length = 50)
   private String nom;

   @Column(nullable = false, length = 50)
   private String prenom;

   @Column(unique = true, nullable = false, length = 100)
   private String email; 

   @Column( name="mot_de_passe", nullable = false, length = 100)
   private String motdepasse;

   @Column(nullable = false,  unique = true, length = 50)
   private String login;

   @Column(nullable = true, length = 20)
   private String telephone;

   /*@Column(nullable = false)
   private LocalDateTime date_creation;
*/
   @Column(nullable = false, length = 20)
   private String statut;
   
   @Column(nullable = false)
private Boolean actif;

@Column(name = "date_inscription", nullable = false)
private LocalDateTime dateInscription;

@PrePersist
public void prePersist() {
    if (actif == null) actif = true;
    if (dateInscription == null) dateInscription = LocalDateTime.now();
}
   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "id_typeutilisateur")
   private TypeUtilisateur typeutilisateur;

   @Override
   public int hashCode() {
      final int prime = 31;
      int result = 1;
      result = prime * result + ((id_utilisateur == null) ? 0 : id_utilisateur.hashCode());
      return result;
   }

   @Override
   public boolean equals(Object obj) {
      if (this == obj)
         return true;
      if (obj == null)
         return false;
      if (getClass() != obj.getClass())
         return false;
      Utilisateur other = (Utilisateur) obj;
      if (id_utilisateur == null) {
         if (other.id_utilisateur != null)
            return false;
      } else if (!id_utilisateur.equals(other.id_utilisateur))
         return false;
      return true;
   }

   @Override
   public String toString() { 
      return "Utilisateur [id_utilisateur=" + id_utilisateur + ", nom=" + nom + ", Prenom=" + prenom + ", email="
            + email + ", Motdepasse=" + motdepasse + ", Login=" + login + ", telephone=" + telephone + ", statut="
            + statut + ", typeutilisateur=" + typeutilisateur + "]";
   }

   

   



   

}
