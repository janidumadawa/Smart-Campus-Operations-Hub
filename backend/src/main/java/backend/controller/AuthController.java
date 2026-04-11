package backend.controller;

import backend.dto.GoogleAuthRequest;
import backend.dto.JwtResponse;
import backend.dto.LoginRequest;
import backend.dto.SignupRequest;
import backend.dto.UserResponse;
import backend.enums.Role;
import backend.model.User;
import backend.repository.UserRepository;
import backend.security.JwtUtils;
import backend.security.UserDetailsImpl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Value("${google.client.id}")
    private String googleClientId;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                new JwtResponse(
                        jwt,
                        userDetails.getId(),
                        userDetails.getEmail(),
                        userDetails.getName(),
                        roles
                )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setName(signUpRequest.getName());
        user.setProvider("local");

        Set<Role> roles = new HashSet<>();
        roles.add(Role.ROLE_USER);

        if (signUpRequest.getRoles() != null) {
            signUpRequest.getRoles().forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        roles.add(Role.ROLE_ADMIN);
                        break;
                    case "technician":
                        roles.add(Role.ROLE_TECHNICIAN);
                        break;
                    default:
                        roles.add(Role.ROLE_USER);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleAuthRequest request) {
        try {
            if (request.getCredential() == null || request.getCredential().isBlank()) {
                return ResponseEntity.badRequest().body("Google credential is required");
            }

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    JacksonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getCredential());

            if (idToken == null) {
                return ResponseEntity.badRequest().body("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");
            String googleId = payload.getSubject();
            Boolean emailVerified = payload.getEmailVerified();

            if (email == null || email.isBlank()) {
                return ResponseEntity.badRequest().body("Google account email not found");
            }

            if (emailVerified == null || !emailVerified) {
                return ResponseEntity.badRequest().body("Google email is not verified");
            }

            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setName(name != null && !name.isBlank() ? name : email);
                user.setProvider("google");
                user.setProviderId(googleId);
                user.setProfilePicture(picture);

                Set<Role> roles = new HashSet<>();
                roles.add(Role.ROLE_USER);
                user.setRoles(roles);

                userRepository.save(user);
            } else {
                user.setProvider("google");
                user.setProviderId(googleId);

                if (user.getName() == null || user.getName().isBlank()) {
                    user.setName(name != null && !name.isBlank() ? name : email);
                }

                if (user.getProfilePicture() == null || user.getProfilePicture().isBlank()) {
                    user.setProfilePicture(picture);
                }

                if (user.getRoles() == null || user.getRoles().isEmpty()) {
                    Set<Role> roles = new HashSet<>();
                    roles.add(Role.ROLE_USER);
                    user.setRoles(roles);
                }

                userRepository.save(user);
            }

            UserDetailsImpl userDetails = UserDetailsImpl.build(user);

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(
                    new JwtResponse(
                            jwt,
                            user.getId(),
                            user.getEmail(),
                            user.getName(),
                            roles
                    )
            );

        } catch (GeneralSecurityException | IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Google authentication failed");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getEmail()).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setProfilePicture(user.getProfilePicture());
        response.setRoles(user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/technicians")
    public ResponseEntity<?> getTechnicians() {
        List<User> technicians = userRepository.findAll().stream()
                .filter(user -> user.getRoles().contains(Role.ROLE_TECHNICIAN))
                .map(user -> {
                    User technician = new User();
                    technician.setId(user.getId());
                    technician.setName(user.getName());
                    technician.setEmail(user.getEmail());
                    return technician;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(technicians);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(user -> {
                    UserResponse response = new UserResponse();
                    response.setId(user.getId());
                    response.setEmail(user.getEmail());
                    response.setName(user.getName());
                    response.setProfilePicture(user.getProfilePicture());
                    response.setRoles(user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()));
                    response.setEnabled(user.isEnabled());
                    response.setProvider(user.getProvider());
                    response.setCreatedAt(user.getCreatedAt());
                    return response;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }
}