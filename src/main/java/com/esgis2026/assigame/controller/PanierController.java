package com.esgis2026.assigame.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.esgis2026.assigame.entity.Panier;
import com.esgis2026.assigame.service.PanierService;

@RestController
@RequestMapping("/api/panier")
public class PanierController {

    private final PanierService panierService;

    public PanierController(PanierService panierService) {
        this.panierService = panierService;
    }

    // GET /api/panier/list
    @GetMapping("/list")
    public List<Panier> getAllPaniers() {
        return panierService.getAllPaniers();
    }

    // GET /api/panier/utilisateur/{idUtilisateur}
    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<Panier> getPaniersByUtilisateur(@PathVariable Long idUtilisateur) {
        return panierService.getPaniersByUtilisateur(idUtilisateur);
    }

    // POST /api/panier/add?idUtilisateur=1&idProduit=2&quantite=3
    @PostMapping("/add")
    public ResponseEntity<Panier> addPanier(
            @RequestParam Long idUtilisateur,
            @RequestParam Long idProduit,
            @RequestParam(defaultValue = "1") int quantite) {
        Panier panier = panierService.createPanier(idUtilisateur, idProduit, quantite);
        return ResponseEntity.ok(panier);
    }

    // PUT /api/panier/update/{id}
    @PutMapping("/update/{id}")
    public ResponseEntity<Panier> updatePanier(
            @PathVariable Long id,
            @RequestBody Panier panier) {
        return ResponseEntity.ok(panierService.updatePanier(id, panier));
    }

    // DELETE /api/panier/delete/{id}
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePanier(@PathVariable Long id) {
        panierService.deletePanier(id);
        return ResponseEntity.noContent().build();
    }
}
