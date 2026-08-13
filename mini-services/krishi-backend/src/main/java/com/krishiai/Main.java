package com.krishiai;

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) throws Exception {
        int port = 8080;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        // Initialize database (creates tables and seeds data)
        System.out.println("[KrishiAI] Initializing database...");
        DbManager.getInstance();

        // Register routes (must be registered BEFORE the root catch-all)
        server.createContext("/api/auth", new AuthService());
        server.createContext("/api/users", new UserService());
        server.createContext("/api/farmers", new UserService());
        server.createContext("/api/farms", new FarmService());
        server.createContext("/api/crops", new CropService());
        server.createContext("/api/products", new ProductService());
        server.createContext("/api/orders", new OrderService());
        server.createContext("/api/cart", new OrderService());
        server.createContext("/api/collection-centers", new CollectionCenterService());
        server.createContext("/api/quality-checks", new CollectionCenterService());
        server.createContext("/api/disease-scans", new DiseaseService());
        server.createContext("/api/soil-health", new SoilHealthService());
        server.createContext("/api/notifications", new NotificationService());
        server.createContext("/api/chat", new ChatService());
        server.createContext("/api/market-prices", new MarketService());
        server.createContext("/api/market-predictions", new MarketService());
        server.createContext("/api/activities", new com.krishiai.ActivityService());
        server.createContext("/api/payouts", new com.krishiai.PayoutService());
        server.createContext("/api/admin/stats", new com.krishiai.AdminService());

        // Health check
        server.createContext("/api/health", exchange -> {
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success("KrishiAI Backend is running!"));
        });

        // Use a thread pool for concurrent request handling
        server.setExecutor(Executors.newFixedThreadPool(20));
        server.start();

        System.out.println("===============================================");
        System.out.println("  🌾 KrishiAI Backend Server Started!");
        System.out.println("  📍 Running on port: " + port);
        System.out.println("  📍 Database: " + new java.io.File("krishiai.db").getAbsolutePath());
        System.out.println("  🔗 Health check: http://localhost:" + port + "/api/health");
        System.out.println("===============================================");

        // Keep server running
        Thread.currentThread().join();
    }
}
