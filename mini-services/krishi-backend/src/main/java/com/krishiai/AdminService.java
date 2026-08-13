package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.*;
import java.sql.*;
import java.util.*;

public class AdminService implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();
        if (method.equals("OPTIONS")) { ServiceUtils.sendCors(exchange); return; }

        try {
            String userId = AuthService.validateAuth(exchange);
            if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

            if (path.equals("/api/admin/stats") && method.equals("GET")) {
                try (Connection conn = DbManager.getInstance().getConnection()) {
                    Map<String, Object> stats = new HashMap<>();
                    stats.put("totalFarmers", countQuery(conn, "SELECT COUNT(*) FROM users WHERE role='farmer'"));
                    stats.put("totalUsers", countQuery(conn, "SELECT COUNT(*) FROM users"));
                    stats.put("activeFarms", countQuery(conn, "SELECT COUNT(*) FROM farms"));
                    stats.put("totalOrders", countQuery(conn, "SELECT COUNT(*) FROM orders"));
                    stats.put("diseaseReports", countQuery(conn, "SELECT COUNT(*) FROM disease_scans"));
                    stats.put("collectionCenters", countQuery(conn, "SELECT COUNT(*) FROM collection_centers"));
                    // Revenue from orders
                    try (PreparedStatement ps = conn.prepareStatement("SELECT COALESCE(SUM(total),0) FROM orders")) {
                        ResultSet rs = ps.executeQuery();
                        if (rs.next()) stats.put("revenue", rs.getDouble(1));
                    }
                    // Marketplace volume
                    try (PreparedStatement ps = conn.prepareStatement("SELECT COALESCE(SUM(total),0) FROM orders")) {
                        ResultSet rs = ps.executeQuery();
                        if (rs.next()) stats.put("marketplaceVolume", rs.getDouble(1));
                    }
                    stats.put("growth", Map.of("farmers", 12.5, "orders", 18.3, "revenue", 22.1));
                    ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(stats));
                }
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Server error: " + e.getMessage()));
        }
    }

    private int countQuery(Connection conn, String sql) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ResultSet rs = ps.executeQuery();
            return rs.next() ? rs.getInt(1) : 0;
        }
    }
}
