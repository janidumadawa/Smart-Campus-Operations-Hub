// backend\src\main\java\backend\BackendApplication.java
package backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "backend")
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);

		// ✅ Clear output
		// System.out.println("=======================================");
		// System.out.println("Tomcat started on port 8081");
		// System.out.println("Started BackendApplication");
		// System.out.println("Backend running at: http://localhost:8081");
		// System.out.println("=======================================");
	}
}