package com.vibe.platform.controller;

import com.vibe.platform.dto.auth.JwtAuthResponse;
import com.vibe.platform.dto.auth.LoginRequest;
import com.vibe.platform.dto.auth.SignupRequest;
import com.vibe.platform.dto.auth.ApiResponse;
import com.vibe.platform.model.User;
import com.vibe.platform.repository.UserRepository;
import com.vibe.platform.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for user: {}", loginRequest.getUsername());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            
            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            logger.info("Login successful for user: {}", loginRequest.getUsername());
            
            return ResponseEntity.ok(new JwtAuthResponse(jwt, "Bearer", user.getUsername(), user.getRole().name()));
        } catch (BadCredentialsException e) {
            logger.warn("Login failed for user: {} - Bad credentials", loginRequest.getUsername());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid username or password"));
        } catch (Exception e) {
            logger.error("Login error for user: {}", loginRequest.getUsername(), e);
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        logger.info("Received registration request for username: {}", signupRequest.getUsername());
        
        try {
            if (userRepository.existsByUsername(signupRequest.getUsername())) {
                logger.warn("Username {} is already taken", signupRequest.getUsername());
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Username is already taken"));
            }

            if (userRepository.existsByEmail(signupRequest.getEmail())) {
                logger.warn("Email {} is already in use", signupRequest.getEmail());
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Email is already in use"));
            }

            User user = User.builder()
                    .username(signupRequest.getUsername())
                    .email(signupRequest.getEmail())
                    .passwordHash(passwordEncoder.encode(signupRequest.getPassword()))
                    .role(User.UserRole.USER)
                    .build();

            userRepository.save(user);
            logger.info("User registered successfully: {}", signupRequest.getUsername());

            return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
        } catch (Exception e) {
            logger.error("Registration error:", e);
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Registration failed: " + e.getMessage()));
        }
    }
} 