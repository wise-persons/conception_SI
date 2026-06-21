package com.esgis2026.assigame.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Permet d'envoyer un vrai fichier image (depuis le formulaire produit du
 * frontend) et de le stocker physiquement sur le serveur, dans le dossier
 * "uploads/" à la racine du projet backend.
 *
 * Le fichier est ensuite accessible publiquement via :
 *   http://localhost:8081/uploads/<nom-genere>.png
 *
 * Cette URL est celle qu'il faut enregistrer dans le champ "image" de
 * l'entité Produit.
 */
@RestController
@RequestMapping("/api/upload")
public class UploadController {

    // Dossier physique où sont stockées les images (créé automatiquement).
    private static final String UPLOAD_DIR = "uploads";

    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {

        Map<String, String> response = new HashMap<>();

        if (file.isEmpty()) {
            response.put("error", "Aucun fichier reçu.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "image";
            String extension = "";
            int dotIndex = originalName.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = originalName.substring(dotIndex);
            }

            String generatedName = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(generatedName);

            Files.write(filePath, file.getBytes());

            String fileUrl = "/uploads/" + generatedName;
            response.put("url", fileUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            response.put("error", "Échec de l'enregistrement du fichier : " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
