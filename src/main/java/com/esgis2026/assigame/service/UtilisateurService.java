package com.esgis2026.assigame.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.repository.UtilisateurRepository;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(UtilisateurRepository utilisateurRepository,
                              PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Utilisateur> getAllUtilisateur() {
        return utilisateurRepository.findAll();
    }

    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
        utilisateur.setActif(true);
        utilisateur.setMotdepasse(
            passwordEncoder.encode(utilisateur.getMotdepasse())
        );

        return utilisateurRepository.save(utilisateur);
    }

    public void deleteUtilisateur(Long idUtilisateur) {
        utilisateurRepository.deleteById(idUtilisateur);
    }

    public Utilisateur updateUtilisateur(Long idUtilisateur, Utilisateur details) {

        Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur not found"));

        utilisateur.setNom(details.getNom());
        utilisateur.setPrenom(details.getPrenom());
        utilisateur.setEmail(details.getEmail());

        if (details.getMotdepasse() != null && !details.getMotdepasse().isEmpty()) {
            utilisateur.setMotdepasse(
                passwordEncoder.encode(details.getMotdepasse())
            );
        }

        return utilisateurRepository.save(utilisateur);
    }
}