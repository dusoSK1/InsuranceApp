package com.example.InsuranceApp_Backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    //  Encoder for passwords
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //  AuthenticationManager — needed for login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    //   HTTP security settings
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF off because we use JWT or session)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users/register", "/api/users/login").permitAll() //register and login are public
                        .requestMatchers("/h2-console/**").permitAll() // h2 console is public
                        .requestMatchers("/api/insurances/**").authenticated() // insurances require login
                        .anyRequest().authenticated() // other requests require authentication
                )
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())) // enable H2 console
                .formLogin(form -> form.disable()) // disable form login
                .httpBasic(basic -> basic.disable()) // disable basic auth
                .logout(logout -> logout.disable()) // logout handled in controller
                .cors(cors -> {}); // CORS configuration is done in WebConfig

        return http.build();
    }
}
