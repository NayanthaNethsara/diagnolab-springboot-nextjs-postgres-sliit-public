package com.diagnolab.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {

        private static final String[] WHITE_LIST_URL = { "/api/auth/**" };
        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(cors -> cors // Enable CORS
                                                .configurationSource(request -> {
                                                        var config = new org.springframework.web.cors.CorsConfiguration();
                                                        config.setAllowedOrigins(List.of("http://localhost:3000",
                                                                        "https://testmedhub.vercel.app"));
                                                        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE",
                                                                        "OPTIONS"));
                                                        config.setAllowedHeaders(
                                                                        List.of("Authorization", "Content-Type"));
                                                        config.setAllowCredentials(true);
                                                        return config;
                                                }))
                                .authorizeHttpRequests(authz -> authz
                                                .requestMatchers(WHITE_LIST_URL).permitAll() // Permit all URLs under
                                                                                             // /api/auth/**
                                                .anyRequest().authenticated() // Authenticate all other requests
                                )
                                .sessionManagement(sess -> sess.sessionCreationPolicy(STATELESS)) // Stateless session
                                                                                                  // management
                                .authenticationProvider(authenticationProvider) // Custom AuthenticationProvider
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT
                                                                                                             // filter

                return http.build();
        }

}
