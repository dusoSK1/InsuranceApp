package com.example.InsuranceApp_Backend.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // Bezpečný 512-bit kľúč pre HS512
    private final SecretKey JWT_SECRET = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private final long JWT_EXPIRATION = 1000 * 60 * 60 * 24; // 24 hodín

    // Generovanie tokenu
    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(JWT_SECRET)
                .compact();
    }

    // Overenie tokenu
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(JWT_SECRET).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    // Získanie emailu z tokenu
    public String getUserEmailFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(JWT_SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // Alias pre kompatibilitu so starším kódom
    public String getUsernameFromToken(String token) {
        return getUserEmailFromJWT(token);
    }
}
