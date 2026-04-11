package backend.controller;

import backend.dto.*;
import backend.enums.Role;
import backend.model.User;
import backend.repository.UserRepository;
import backend.security.JwtUtils;
import backend.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
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

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getEmail(), userDetails.getName(), roles));
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
}