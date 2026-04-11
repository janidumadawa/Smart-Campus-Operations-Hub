package backend.config;

import backend.enums.Role;
import backend.model.User;
import backend.repository.UserRepository;
import backend.service.NotificationService;
import backend.service.NotificationHelper;
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
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private NotificationHelper notificationHelper;

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

        // Initialize Default Student
        if (!userRepository.existsByEmail("student@sliit.lk")) {
            User student = new User();
            student.setEmail("student@sliit.lk");
            student.setPassword(passwordEncoder.encode("Student@123"));
            student.setName("Student User");
            student.setProvider("local");
            Set<Role> studentRoles = new HashSet<>();
            studentRoles.add(Role.ROLE_USER);
            student.setRoles(studentRoles);
            userRepository.save(student);
            System.out.println("Student user created: student@sliit.lk / Student@123");
            
            // Seed welcome notification
            notificationService.createNotification(
                student.getId(),
                backend.enums.NotificationType.SYSTEM_ALERT,
                backend.enums.NotificationCategory.SYSTEM,
                "Welcome to CampusFlow!",
                "Welcome to your new campus operations platform. Here you can book resources, manage tickets, and stay updated.",
                null,
                "SYSTEM"
            );
        }
    }
}