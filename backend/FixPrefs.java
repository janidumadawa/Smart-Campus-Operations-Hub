import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import com.mongodb.client.model.Filters;

public class FixPrefs {
    public static void main(String[] args) {
        String uri = "mongodb+srv://ahinsi-db:vuhwaH4DfbTpd0J9@cluster0.vpkxvmi.mongodb.net/smart_campus_db?retryWrites=true&w=majority";
        try (MongoClient mongoClient = MongoClients.create(uri)) {
            MongoDatabase database = mongoClient.getDatabase("smart_campus_db");
            
            MongoCollection<Document> prefs = database.getCollection("notification_preferences");
            
            System.out.println("Deleting existing preferences for student@sliit.lk...");
            prefs.deleteMany(Filters.eq("userId", "student@sliit.lk"));
            
            System.out.println("Cleaning up any null or undefined userId records...");
            prefs.deleteMany(Filters.eq("userId", null));
            prefs.deleteMany(Filters.eq("userId", "undefined"));
            prefs.deleteMany(Filters.eq("userId", "null"));
            
            System.out.println("Database cleanup complete.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
