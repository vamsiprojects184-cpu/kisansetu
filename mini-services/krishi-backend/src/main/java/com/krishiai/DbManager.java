package com.krishiai;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DbManager {
    private static final String DB_URL = "jdbc:sqlite:krishi.db";
    private static DbManager instance;

    static {
        try {
            Class.forName("org.sqlite.JDBC");
        } catch (ClassNotFoundException e) {
            System.err.println("[DB] SQLite JDBC driver not found: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private DbManager() {
        initDatabase();
    }

    public static synchronized DbManager getInstance() {
        if (instance == null) {
            instance = new DbManager();
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL);
    }

    public void initDatabase() {
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            // Users table
            stmt.execute("CREATE TABLE IF NOT EXISTS users (" +
                "id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE, phone TEXT UNIQUE, " +
                "password_hash TEXT, role TEXT NOT NULL DEFAULT 'farmer', language TEXT DEFAULT 'en', " +
                "state TEXT, district TEXT, village TEXT, location TEXT, " +
                "is_onboarded INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')))");

            // Farms table
            stmt.execute("CREATE TABLE IF NOT EXISTS farms (" +
                "id TEXT PRIMARY KEY, farmer_id TEXT NOT NULL, name TEXT NOT NULL, " +
                "location TEXT, state TEXT, district TEXT, village TEXT, " +
                "total_acres REAL, irrigation_available INTEGER DEFAULT 0, " +
                "soil_type TEXT, soil_health_score INTEGER DEFAULT 0, " +
                "created_at TEXT DEFAULT (datetime('now')), " +
                "FOREIGN KEY (farmer_id) REFERENCES users(id))");

            // Crops table
            stmt.execute("CREATE TABLE IF NOT EXISTS crops (" +
                "id TEXT PRIMARY KEY, farm_id TEXT NOT NULL, name TEXT NOT NULL, " +
                "name_local TEXT, icon TEXT DEFAULT '🌱', stage TEXT DEFAULT 'planting', " +
                "health TEXT DEFAULT 'healthy', planted_date TEXT, expected_harvest_date TEXT, " +
                "days_to_harvest INTEGER DEFAULT 0, acres REAL DEFAULT 0, variety TEXT, " +
                "expected_yield REAL, expected_revenue REAL, " +
                "created_at TEXT DEFAULT (datetime('now')), " +
                "FOREIGN KEY (farm_id) REFERENCES farms(id))");

            // Products table
            stmt.execute("CREATE TABLE IF NOT EXISTS products (" +
                "id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT, price REAL, " +
                "unit TEXT, rating REAL DEFAULT 0, review_count INTEGER DEFAULT 0, " +
                "farmer_id TEXT, farmer_name TEXT, farmer_location TEXT, " +
                "quality_score INTEGER, harvest_date TEXT, " +
                "in_stock INTEGER DEFAULT 1, is_certified INTEGER DEFAULT 0, " +
                "germination TEXT, description TEXT, image_url TEXT, " +
                "created_at TEXT DEFAULT (datetime('now')))");

            // Orders table
            stmt.execute("CREATE TABLE IF NOT EXISTS orders (" +
                "id TEXT PRIMARY KEY, user_id TEXT NOT NULL, items_json TEXT NOT NULL, " +
                "total REAL, status TEXT DEFAULT 'placed', delivery_address TEXT, " +
                "delivery_method TEXT, payment_method TEXT, estimated_delivery TEXT, " +
                "created_at TEXT DEFAULT (datetime('now')), " +
                "FOREIGN KEY (user_id) REFERENCES users(id))");

            // Cart items table
            stmt.execute("CREATE TABLE IF NOT EXISTS cart_items (" +
                "id TEXT PRIMARY KEY, user_id TEXT NOT NULL, product_id TEXT NOT NULL, " +
                "quantity INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')), " +
                "FOREIGN KEY (user_id) REFERENCES users(id), " +
                "FOREIGN KEY (product_id) REFERENCES products(id))");

            // Collection centers table
            stmt.execute("CREATE TABLE IF NOT EXISTS collection_centers (" +
                "id TEXT PRIMARY KEY, name TEXT, address TEXT, distance REAL, " +
                "is_open INTEGER DEFAULT 1, accepted_crops_json TEXT, " +
                "operating_hours TEXT, current_capacity INTEGER DEFAULT 0, " +
                "max_capacity INTEGER DEFAULT 100, phone TEXT)");

            // Quality checks table
            stmt.execute("CREATE TABLE IF NOT EXISTS quality_checks (" +
                "id TEXT PRIMARY KEY, product_name TEXT, farmer_name TEXT, " +
                "quality_score INTEGER DEFAULT 0, grade TEXT DEFAULT 'standard', " +
                "freshness INTEGER DEFAULT 0, size_consistency INTEGER DEFAULT 0, " +
                "appearance INTEGER DEFAULT 0, damage_check INTEGER DEFAULT 0, " +
                "status TEXT DEFAULT 'pending', verified_at TEXT, center_id TEXT, " +
                "FOREIGN KEY (center_id) REFERENCES collection_centers(id))");

            // Soil health table
            stmt.execute("CREATE TABLE IF NOT EXISTS soil_health (" +
                "id TEXT PRIMARY KEY, farm_id TEXT NOT NULL, score INTEGER DEFAULT 0, " +
                "grade TEXT, nitrogen_value REAL, nitrogen_status TEXT, " +
                "phosphorus_value REAL, phosphorus_status TEXT, " +
                "potassium_value REAL, potassium_status TEXT, " +
                "ph REAL DEFAULT 0, organic_carbon REAL DEFAULT 0, moisture REAL DEFAULT 0, " +
                "recommendations_json TEXT, suitable_crops_json TEXT, last_test_date TEXT, " +
                "FOREIGN KEY (farm_id) REFERENCES farms(id))");

            // Disease scans table
            stmt.execute("CREATE TABLE IF NOT EXISTS disease_scans (" +
                "id TEXT PRIMARY KEY, user_id TEXT, crop_name TEXT, " +
                "disease_name TEXT, confidence REAL DEFAULT 0, severity TEXT, " +
                "description TEXT, causes_json TEXT, actions_json TEXT, " +
                "prevention_json TEXT, status TEXT DEFAULT 'pending', " +
                "needs_expert_review INTEGER DEFAULT 0, " +
                "created_at TEXT DEFAULT (datetime('now')), " +
                "FOREIGN KEY (user_id) REFERENCES users(id))");

            // Notifications table
            stmt.execute("CREATE TABLE IF NOT EXISTS notifications (" +
                "id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT, " +
                "message TEXT, type TEXT DEFAULT 'info', is_read INTEGER DEFAULT 0, " +
                "icon TEXT, created_at TEXT DEFAULT (datetime('now')), " +
                "FOREIGN KEY (user_id) REFERENCES users(id))");

            // Chat messages table
            stmt.execute("CREATE TABLE IF NOT EXISTS chat_messages (" +
                "id TEXT PRIMARY KEY, user_id TEXT NOT NULL, role TEXT NOT NULL, " +
                "content TEXT NOT NULL, timestamp TEXT DEFAULT (datetime('now')), " +
                "FOREIGN KEY (user_id) REFERENCES users(id))");

            // Market prices table
            stmt.execute("CREATE TABLE IF NOT EXISTS market_prices (" +
                "id TEXT PRIMARY KEY, crop TEXT, price REAL, unit TEXT, " +
                "change REAL, change_percent REAL, market TEXT, " +
                "date TEXT DEFAULT (datetime('now')))");

            // Payouts table
            stmt.execute("CREATE TABLE IF NOT EXISTS payouts (" +
                "id TEXT PRIMARY KEY, farmer_name TEXT, crop TEXT, " +
                "amount REAL, date TEXT, status TEXT DEFAULT 'pending', " +
                "center_id TEXT, " +
                "FOREIGN KEY (center_id) REFERENCES collection_centers(id))");

            // Activities table
            stmt.execute("CREATE TABLE IF NOT EXISTS activities (" +
                "id TEXT PRIMARY KEY, user_id TEXT, farm_id TEXT, type TEXT, " +
                "title TEXT, description TEXT, date TEXT DEFAULT (datetime('now')), " +
                "FOREIGN KEY (user_id) REFERENCES users(id), " +
                "FOREIGN KEY (farm_id) REFERENCES farms(id))");

            // Seed data
            seedData(conn);

            System.out.println("[DB] Database initialized successfully.");
        } catch (SQLException e) {
            System.err.println("[DB] Error initializing database: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void seedData(Connection conn) throws SQLException {
        // Check if data already exists
        try (ResultSet rs = conn.createStatement().executeQuery("SELECT COUNT(*) FROM users")) {
            if (rs.next() && rs.getInt(1) > 0) {
                System.out.println("[DB] Seed data already exists, skipping.");
                return;
            }
        }

        System.out.println("[DB] Inserting seed data...");

        // Seed users - password is SHA-256 of 'demo123'
        String passHash = sha256("demo123");

        String[] users = {
            "INSERT INTO users (id,name,email,phone,password_hash,role,language,state,district,village,location,is_onboarded,created_at) VALUES ('f1','Vamsi Krishna','vamsi@farm.ai','+91 9876543210','" + passHash + "','farmer','en','Telangana','Siddipet','Gajwel','Siddipet, Telangana',1,'2024-06-15')",
            "INSERT INTO users (id,name,email,phone,password_hash,role,language,state,district,location,is_onboarded,created_at) VALUES ('c1','Priya Sharma','priya@gmail.com','+91 9123456789','" + passHash + "','consumer','en','Telangana','Hyderabad','Hyderabad, Telangana',1,'2024-09-01')",
            "INSERT INTO users (id,name,email,phone,password_hash,role,language,state,district,location,is_onboarded,created_at) VALUES ('cc1-user','Rajesh Kumar','rajesh@greenagri.in','+91 9988776655','" + passHash + "','collection_center','en','Telangana','Warangal','Warangal, Telangana',1,'2024-03-10')",
            "INSERT INTO users (id,name,email,phone,password_hash,role,language,state,district,location,is_onboarded,created_at) VALUES ('e1','Dr. Anitha Reddy','anitha@agri-expert.in','+91 9876501234','" + passHash + "','expert','en','Telangana','Hyderabad','Hyderabad, Telangana',1,'2024-01-20')",
            "INSERT INTO users (id,name,email,phone,password_hash,role,language,state,district,location,is_onboarded,created_at) VALUES ('a1','Admin User','admin@krishiai.com','+91 9000000001','" + passHash + "','admin','en','Telangana','Hyderabad','Hyderabad, Telangana',1,'2023-01-01')",
        };
        for (String sql : users) {
            try (PreparedStatement ps = conn.prepareStatement(sql)) { ps.execute(); } catch (SQLException e) { /* ignore duplicate */ }
        }

        // Seed farms
        String[] farms = {
            "INSERT INTO farms (id,farmer_id,name,location,state,district,village,total_acres,irrigation_available,soil_type,soil_health_score,created_at) VALUES ('farm1','f1','Green Valley Farm','Gajwel, Siddipet','Telangana','Siddipet','Gajwel',5,1,'Red Sandy Loam',82,'2024-06-15')",
            "INSERT INTO farms (id,farmer_id,name,location,state,district,village,total_acres,irrigation_available,soil_type,soil_health_score,created_at) VALUES ('farm2','f1','Cherry Blossom Acres','Wargal, Siddipet','Telangana','Siddipet','Wargal',3,1,'Black Cotton Soil',75,'2024-08-01')",
        };
        for (String sql : farms) {
            try (PreparedStatement ps = conn.prepareStatement(sql)) { ps.execute(); } catch (SQLException e) { /* ignore */ }
        }

        // Seed crops
        String[] crops = {
            "INSERT INTO crops (id,farm_id,name,name_local,icon,stage,health,planted_date,expected_harvest_date,days_to_harvest,acres,variety,expected_yield,expected_revenue) VALUES ('crop1','farm1','Tomato','టమాట','🍅','flowering','healthy','2024-11-01','2025-02-15',42,2,'Hybrid GT-4',12000,120000)",
            "INSERT INTO crops (id,farm_id,name,name_local,icon,stage,health,planted_date,expected_harvest_date,days_to_harvest,acres,variety,expected_yield,expected_revenue) VALUES ('crop2','farm1','Rice','వరి','🌾','vegetative','healthy','2024-10-15','2025-02-28',68,3,'BPT-5204 (Samba Masuri)',7500,150000)",
            "INSERT INTO crops (id,farm_id,name,name_local,icon,stage,health,planted_date,expected_harvest_date,days_to_harvest,acres,variety,expected_yield,expected_revenue) VALUES ('crop3','farm2','Chilli','మిర్చి','🌶️','fruiting','moderate','2024-09-01','2025-01-15',15,1.5,'Guntur Chilli',3000,90000)",
        };
        for (String sql : crops) {
            try (PreparedStatement ps = conn.prepareStatement(sql)) { ps.execute(); } catch (SQLException e) { /* ignore */ }
        }

        // Seed products - seeds
        String[] seedProducts = {
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,in_stock,is_certified,germination,description) VALUES ('s1','Tomato Hybrid GT-4 Seeds','Vegetables',450,'packet',4.5,234,1,1,'95%','High-yielding hybrid tomato seeds suitable for rabi season. Resistant to common diseases.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,in_stock,is_certified,germination,description) VALUES ('s2','Rice BPT-5204 Seeds','Grains',380,'kg',4.7,567,1,1,'92%','Premium Samba Masuri variety. Fine grain quality with excellent cooking properties.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,in_stock,is_certified,germination,description) VALUES ('s3','Guntur Chilli Seeds','Vegetables',520,'packet',4.3,189,1,1,'88%','Authentic Guntur chilli variety known for high pungency and bright red color.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,in_stock,is_certified,germination,description) VALUES ('s4','Cotton Bt Hybrid Seeds','Fibers',820,'packet',4.6,321,1,1,'90%','Bt cotton hybrid with high boll weight and excellent fiber quality.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,in_stock,is_certified,germination,description) VALUES ('s5','Maize Hybrid 900M Seeds','Grains',350,'packet',4.4,145,1,1,'93%','High-yielding maize hybrid suitable for both rabi and kharif seasons.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,in_stock,is_certified,germination,description) VALUES ('s6','Brinjal Purple Long Seeds','Vegetables',280,'packet',4.2,98,1,1,'90%','Long purple brinjal variety with excellent shelf life and taste.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,in_stock,is_certified,germination,description) VALUES ('s7','Onion N-53 Seeds','Vegetables',320,'packet',4.1,76,1,1,'85%','Medium-sized onion variety with good storage quality.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,in_stock,is_certified,germination,description) VALUES ('s8','Okra Pusa Sawani Seeds','Vegetables',200,'packet',4.5,210,1,1,'92%','Popular okra variety with tender pods and high yield potential.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,in_stock,is_certified,germination,description) VALUES ('s9','Organic Tomato Seeds','Organic',580,'packet',4.8,56,1,1,'88%','Certified organic tomato seeds. No chemical treatment.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,in_stock,is_certified,germination,description) VALUES ('s10','Watermelon Sugar Baby Seeds','Fruits',390,'packet',4.3,87,0,1,'87%','Compact watermelon variety perfect for small farms. Sweet and early maturing.')",
        };
        for (String sql : seedProducts) {
            try (PreparedStatement ps = conn.prepareStatement(sql)) { ps.execute(); } catch (SQLException e) { /* ignore */ }
        }

        // Seed products - consumer products
        String[] consumerProducts = {
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,farmer_name,farmer_location,quality_score,harvest_date,in_stock,is_certified,description) VALUES ('p1','Fresh Tomatoes','Vegetables',40,'kg',4.6,89,'Green Valley Farm','Siddipet, Telangana',91,'2025-01-05',1,1,'Farm-fresh tomatoes, hand-picked at peak ripeness.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,farmer_name,farmer_location,quality_score,harvest_date,in_stock,is_certified,description) VALUES ('p2','Premium Basmati Rice','Grains',85,'kg',4.8,234,'Rajesh Farms','Karimnagar, Telangana',95,'2024-12-20',1,1,'Aromatic basmati rice, aged for 6 months for perfect flavor.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,farmer_name,farmer_location,quality_score,harvest_date,in_stock,is_certified,description) VALUES ('p3','Red Chilli Powder','Spices',320,'kg',4.7,456,'Spice Coop','Guntur, Andhra Pradesh',93,'2025-01-01',1,1,'Pure Guntur chilli powder, no additives. Rich red color and heat.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,farmer_name,farmer_location,quality_score,harvest_date,in_stock,is_certified,description) VALUES ('p4','Fresh Brinjal','Vegetables',35,'kg',4.4,67,'Green Valley Farm','Siddipet, Telangana',88,'2025-01-05',1,1,'Fresh purple brinjal, harvested daily from local farms.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,farmer_name,farmer_location,quality_score,harvest_date,in_stock,is_certified,description) VALUES ('p5','Organic Onions','Vegetables',45,'kg',4.5,123,'Organic Acres','Nizamabad, Telangana',90,'2025-01-04',1,1,'Certified organic onions, naturally grown without chemicals.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,farmer_name,farmer_location,quality_score,harvest_date,in_stock,is_certified,description) VALUES ('p6','Farm Fresh Eggs','Dairy',80,'dozen',4.7,345,'Happy Hens Farm','Medak, Telangana',94,'2025-01-06',1,1,'Free-range country eggs from healthy, naturally fed hens.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,farmer_name,farmer_location,quality_score,harvest_date,in_stock,is_certified,description) VALUES ('p7','Fresh Green Chillies','Vegetables',60,'kg',4.3,78,'Green Valley Farm','Siddipet, Telangana',87,'2025-01-05',1,1,'Fresh green chillies, medium spicy, perfect for daily cooking.')",
            "INSERT INTO products (id,name,category,price,unit,rating,review_count,farmer_name,farmer_location,quality_score,harvest_date,in_stock,is_certified,description) VALUES ('p8','Raw Cotton (Kapas)','Fibers',7500,'quintal',4.6,34,'Cotton Belt Farm','Adilabad, Telangana',92,'2024-12-15',1,1,'Premium quality raw cotton, high staple length.')",
        };
        for (String sql : consumerProducts) {
            try (PreparedStatement ps = conn.prepareStatement(sql)) { ps.execute(); } catch (SQLException e) { /* ignore */ }
        }

        // Seed collection centers
        String[] centers = {
            "INSERT INTO collection_centers (id,name,address,distance,is_open,accepted_crops_json,operating_hours,current_capacity,max_capacity,phone) VALUES ('cc1','GreenAgri Collection Center','Main Road, Warangal Urban, Telangana',4.2,1,'[\"Tomato\",\"Chilli\",\"Onion\",\"Brinjal\"]','6:00 AM - 8:00 PM',65,100,'+91 98765 43210')",
            "INSERT INTO collection_centers (id,name,address,distance,is_open,accepted_crops_json,operating_hours,current_capacity,max_capacity,phone) VALUES ('cc2','Krishna Agri Hub','Station Road, Karimnagar, Telangana',12.5,1,'[\"Rice\",\"Maize\",\"Cotton\"]','7:00 AM - 6:00 PM',40,80,'+91 87654 32109')",
            "INSERT INTO collection_centers (id,name,address,distance,is_open,accepted_crops_json,operating_hours,current_capacity,max_capacity,phone) VALUES ('cc3','Farm Fresh Mandi','Market Yard, Siddipet, Telangana',2.1,0,'[\"Tomato\",\"Brinjal\",\"Okra\",\"Onion\"]','5:00 AM - 2:00 PM',80,100,'+91 76543 21098')",
            "INSERT INTO collection_centers (id,name,address,distance,is_open,accepted_crops_json,operating_hours,current_capacity,max_capacity,phone) VALUES ('cc4','Telangana Agri Market','Industrial Area, Hyderabad, Telangana',45,1,'[\"All Vegetables\",\"All Grains\",\"Spices\"]','6:00 AM - 10:00 PM',30,200,'+91 65432 10987')",
        };
        for (String sql : centers) {
            try (PreparedStatement ps = conn.prepareStatement(sql)) { ps.execute(); } catch (SQLException e) { /* ignore */ }
        }

        // Seed market prices
        String[] prices = {
            "INSERT INTO market_prices (id,crop,price,unit,change,change_percent,market,date) VALUES ('mp1','Tomato',28,'kg',2.5,8,'Hyderabad','2025-01-06')",
            "INSERT INTO market_prices (id,crop,price,unit,change,change_percent,market,date) VALUES ('mp2','Rice',32,'kg',-0.5,-1.5,'Warangal','2025-01-06')",
            "INSERT INTO market_prices (id,crop,price,unit,change,change_percent,market,date) VALUES ('mp3','Chilli',180,'kg',12,7,'Guntur','2025-01-06')",
            "INSERT INTO market_prices (id,crop,price,unit,change,change_percent,market,date) VALUES ('mp4','Onion',35,'kg',-8,-18,'Hyderabad','2025-01-06')",
            "INSERT INTO market_prices (id,crop,price,unit,change,change_percent,market,date) VALUES ('mp5','Cotton',7521,'quintal',120,1.6,'Adilabad','2025-01-06')",
            "INSERT INTO market_prices (id,crop,price,unit,change,change_percent,market,date) VALUES ('mp6','Maize',22,'kg',1,4.8,'Karimnagar','2025-01-06')",
            "INSERT INTO market_prices (id,crop,price,unit,change,change_percent,market,date) VALUES ('mp7','Brinjal',25,'kg',3,12,'Hyderabad','2025-01-06')",
            "INSERT INTO market_prices (id,crop,price,unit,change,change_percent,market,date) VALUES ('mp8','Potato',20,'kg',-2,-9,'Hyderabad','2025-01-06')",
        };
        for (String sql : prices) {
            try (PreparedStatement ps = conn.prepareStatement(sql)) { ps.execute(); } catch (SQLException e) { /* ignore */ }
        }

        // Seed notifications for farmer
        String[] notifications = {
            "INSERT INTO notifications (id,user_id,title,message,type,is_read,created_at,icon) VALUES ('n1','f1','Weather Alert','Heavy rainfall expected tomorrow. Avoid fertilizer application.','warning',0,'2025-01-06T09:00:00','🌧️')",
            "INSERT INTO notifications (id,user_id,title,message,type,is_read,created_at,icon) VALUES ('n2','f1','Irrigation Reminder','Your tomato crop needs irrigation today. Best time: 6-8 AM.','alert',0,'2025-01-06T08:00:00','💧')",
            "INSERT INTO notifications (id,user_id,title,message,type,is_read,created_at,icon) VALUES ('n3','f1','Market Update','Tomato prices increased by 8% in Hyderabad market today.','success',0,'2025-01-06T07:00:00','📈')",
            "INSERT INTO notifications (id,user_id,title,message,type,is_read,created_at,icon) VALUES ('n4','f1','Order Delivered','Your order ORD-2025-001 has been delivered successfully.','success',1,'2025-01-05T10:30:00','✅')",
            "INSERT INTO notifications (id,user_id,title,message,type,is_read,created_at,icon) VALUES ('n5','f1','New AI Advisory','Dr. Reddy has published a new advisory on managing early blight in tomato.','info',1,'2025-01-04T14:00:00','🔬')",
        };
        for (String sql : notifications) {
            try (PreparedStatement ps = conn.prepareStatement(sql)) { ps.execute(); } catch (SQLException e) { /* ignore */ }
        }

        // Seed disease scans
        String[] diseases = {
            "INSERT INTO disease_scans (id,user_id,crop_name,disease_name,confidence,severity,description,causes_json,actions_json,prevention_json,status,needs_expert_review,created_at) VALUES ('d1','f1','Tomato','Early Blight',91,'moderate','Early blight is a common fungal disease affecting tomato plants, caused by Alternaria solani. It typically appears as dark, concentric ring-shaped spots on older leaves.','[\"High humidity conditions\",\"Overhead irrigation\",\"Poor air circulation\",\"Nitrogen deficiency\"]','[\"Remove and destroy affected leaves immediately\",\"Apply copper-based fungicide (Bordeaux mixture)\",\"Improve air circulation by proper plant spacing\",\"Avoid overhead irrigation - use drip irrigation instead\",\"Apply neem oil spray as organic treatment\"]','[\"Practice crop rotation (3-year cycle)\",\"Use resistant tomato varieties\",\"Ensure proper plant spacing (60cm between plants)\",\"Apply preventive fungicide before rainy season\",\"Keep foliage dry during irrigation\"]','completed',0,'2025-01-06T10:30:00')",
        };
        for (String sql : diseases) {
            try (PreparedStatement ps = conn.prepareStatement(sql)) { ps.execute(); } catch (SQLException e) { /* ignore */ }
        }

        // Seed quality checks
        String[] qualityChecks = {
            "INSERT INTO quality_checks (id,product_name,farmer_name,quality_score,grade,freshness,size_consistency,appearance,damage_check,verified_at,status,center_id) VALUES ('qc1','Tomato','Vamsi Krishna',91,'premium',94,88,92,90,'2025-01-06','verified','cc1')",
            "INSERT INTO quality_checks (id,product_name,farmer_name,quality_score,grade,freshness,size_consistency,appearance,damage_check,verified_at,status,center_id) VALUES ('qc2','Chilli','Ramesh Reddy',78,'standard',82,70,80,80,'2025-01-06','verified','cc1')",
            "INSERT INTO quality_checks (id,product_name,farmer_name,quality_score,grade,freshness,size_consistency,appearance,damage_check,verified_at,status,center_id) VALUES ('qc3','Brinjal','Suresh Kumar',0,'standard',0,0,0,0,'','pending','cc1')",
        };
        for (String sql : qualityChecks) {
            try (PreparedStatement ps = conn.prepareStatement(sql)) { ps.execute(); } catch (SQLException e) { /* ignore */ }
        }

        // Seed soil health for farm1
        String[] soilHealths = {
            "INSERT INTO soil_health (id,farm_id,score,grade,nitrogen_value,nitrogen_status,phosphorus_value,phosphorus_status,potassium_value,potassium_status,ph,organic_carbon,moisture,recommendations_json,suitable_crops_json,last_test_date) VALUES ('sh1','farm1',82,'good',245,'low',32,'optimal',380,'optimal',6.8,0.72,34,'[\"Add organic compost to improve nitrogen levels\",\"Apply vermicompost at 2 tonnes per acre\",\"Consider green manuring with dhaincha crop\",\"Retest soil after 45 days of treatment\"]','[\"Tomato\",\"Brinjal\",\"Chilli\",\"Okra\",\"Cotton\"]','2024-12-15')",
        };
        for (String sql : soilHealths) {
            try (PreparedStatement ps = conn.prepareStatement(sql)) { ps.execute(); } catch (SQLException e) { /* ignore */ }
        }

        // Seed orders
        String[] orders = {
            "INSERT INTO orders (id,user_id,items_json,total,status,delivery_address,delivery_method,payment_method,estimated_delivery,created_at) VALUES ('ORD-2025-001','c1','[{\"productId\":\"p1\",\"quantity\":5},{\"productId\":\"p4\",\"quantity\":2}]',270,'delivered','Flat 302, Green Towers, Madhapur, Hyderabad','Express Delivery','UPI','2024-12-30','2024-12-28')",
            "INSERT INTO orders (id,user_id,items_json,total,status,delivery_address,delivery_method,payment_method,estimated_delivery,created_at) VALUES ('ORD-2025-002','c1','[{\"productId\":\"p6\",\"quantity\":3}]',240,'out_for_delivery','Flat 302, Green Towers, Madhapur, Hyderabad','Standard Delivery','Cash on Delivery','2025-01-07','2025-01-05')",
        };
        for (String sql : orders) {
            try (PreparedStatement ps = conn.prepareStatement(sql)) { ps.execute(); } catch (SQLException e) { /* ignore */ }
        }

        // Seed payouts
        String[] payouts = {
            "INSERT INTO payouts (id,farmer_name,crop,amount,date,status,center_id) VALUES ('pay1','Vamsi Krishna','Tomato',12000,'2025-01-06','completed','cc1')",
            "INSERT INTO payouts (id,farmer_name,crop,amount,date,status,center_id) VALUES ('pay2','Ramesh Reddy','Chilli',8500,'2025-01-06','pending','cc1')",
        };
        for (String sql : payouts) {
            try (PreparedStatement ps = conn.prepareStatement(sql)) { ps.execute(); } catch (SQLException e) { /* ignore */ }
        }

        System.out.println("[DB] Seed data inserted successfully.");
    }

    public static String sha256(String input) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
