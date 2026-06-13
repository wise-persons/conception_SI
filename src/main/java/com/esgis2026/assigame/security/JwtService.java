package com.esgis2026.assigame.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    private static final String SECRET_KEY = "mySecretKeyMySecretKeyMySecretKeyMySecretKey123456789";


    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1h
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();

        } catch (ExpiredJwtException e) {
            System.out.println(" Token expiré");
        } catch (UnsupportedJwtException e) {
            System.out.println(" Token non supporté");
        } catch (MalformedJwtException e) {
            System.out.println(" Token mal formé");
            System.out.println(" Signature invalide");
        } catch (IllegalArgumentException e) {
            System.out.println(" Token vide ou invalide");
        }

        return null;
    }
    public boolean isTokenValid(String token) {
        return extractUsername(token) != null;
    }
}