package com.esgis2026.assigame.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Permet d'accéder publiquement aux fichiers uploadés (images de produits)
 * via l'URL http://localhost:8081/uploads/<fichier>, en les servant
 * directement depuis le dossier physique "uploads/" du projet.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
            .addResourceHandler("/uploads/**")
            .addResourceLocations("file:uploads/");
    }
}
