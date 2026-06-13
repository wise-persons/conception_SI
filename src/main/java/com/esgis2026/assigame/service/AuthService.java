package com.esgis2026.assigame.service;

import com.esgis2026.assigame.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public String login(String login, String password) {

        // 1. Authentification Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(login, password)
        );

        // 2. Génération du token JWT
        return jwtService.generateToken(login);
    }
}