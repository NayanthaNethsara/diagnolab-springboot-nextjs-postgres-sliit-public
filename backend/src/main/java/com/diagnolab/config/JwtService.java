package com.diagnolab.config;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import com.diagnolab.entity.user.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

  // Consider storing the secret key in an environment variable for better security
  private final String SECRET_KEY = "4eefd5e7bbcc42ec0d585064128b1ad4445f91f583345b61262e467d83c50c8b";

  // Extract username (subject) from token
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  // Extract specific claims
  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  // Generate token without extra claims
  public String generateToken(User userDetails) {
    return generateToken(new HashMap<>(), userDetails);
  }

  // Generate token with extra claims (like role)
  public String generateToken(Map<String, Object> extraClaims, User userDetails) {
    // Add role to the claims
    if (userDetails.getRole() != null) {
      extraClaims.put("role", userDetails.getRole());
    }
    return Jwts.builder()
            .setClaims(extraClaims)
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Token valid for 10 hours
            .signWith(getSignInKey(), SignatureAlgorithm.HS256)
            .compact();
  }

  // Validate token by comparing username and ensuring it's not expired
  public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
  }

  // Check if the token is expired
  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  // Extract expiration date from token
  private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  // Extract all claims from the token
  private Claims extractAllClaims(String token) {
    return Jwts
            .parserBuilder()
            .setSigningKey(getSignInKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
  }

  // Get the signing key using the secret
  private Key getSignInKey() {
    byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
