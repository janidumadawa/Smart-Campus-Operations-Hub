import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;

public class DbCheck {
    public static void main(String[] args) {
        String connectionString = "mongodb+srv://paf:paf123@paf.vpkxvmi.mongodb.net/smart_campus?retryWrites=true&w=majority";
        try (MongoClient mongoClient = MongoClients.create(connectionString)) {
            MongoDatabase database = mongoClient.getDatabase("smart_campus");
            
            System.out.println("Checking Users...");
            MongoCollection<Document> users = database.getCollection("users");
            users.find().forEach(doc -> System.out.println("User: " + doc.toJson()));
            
            System.out.println("\nChecking Preferences...");
            MongoCollection<Document> prefs = database.getCollection("notification_preferences");
            prefs.find().forEach(doc -> System.out.println("Pref: " + doc.toJson()));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
