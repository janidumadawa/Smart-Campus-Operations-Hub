package backend.config;

import backend.enums.Role;
import backend.model.User;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Admin
        if (!userRepository.existsByEmail("admin@sliit.lk")) {
            User admin = new User();
            admin.setEmail("admin@sliit.lk");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setName("System Administrator");
            admin.setProvider("local");
            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(Role.ROLE_ADMIN);
            adminRoles.add(Role.ROLE_USER);
            admin.setRoles(adminRoles);
            userRepository.save(admin);
            System.out.println("Admin user created: admin@sliit.lk / Admin@123");
        }

        // Initialize Technicians
        String[][] technicians = {
            {"technician1@sliit.lk", "Tech@1", "Technician One"},
            {"technician2@sliit.lk", "Tech@2", "Technician Two"},
            {"technician3@sliit.lk", "Tech@3", "Technician Three"}
        };

        for (String[] tech : technicians) {
            if (!userRepository.existsByEmail(tech[0])) {
                User technician = new User();
                technician.setEmail(tech[0]);
                technician.setPassword(passwordEncoder.encode(tech[1]));
                technician.setName(tech[2]);
                technician.setProvider("local");
                Set<Role> techRoles = new HashSet<>();
                techRoles.add(Role.ROLE_TECHNICIAN);
                techRoles.add(Role.ROLE_USER);
                technician.setRoles(techRoles);
                userRepository.save(technician);
                System.out.println("Technician created: " + tech[0] + " / " + tech[1]);
            }
        }
    }
}