package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.*;
import java.sql.*;
import java.util.*;

public class PayoutService implements HttpHandler {
    private static final Gson gson = new Gson();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();
        if (method.equals("OPTIONS")) { ServiceUtils.sendCors(exchange); return; }

        try {
            String userId = AuthService.validateAuth(exchange);
            if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

            if (path.equals("/api/payouts") && method.equals("GET")) {
                try (Connection conn = DbManager.getInstance().getConnection()) {
                    String sql = "SELECT * FROM payouts ORDER BY date DESC LIMIT 50";
                    try (PreparedStatement ps = conn.prepareStatement(sql)) {
                        ResultSet rs = ps.executeQuery();
                        List<Map<String, Object>> list = new ArrayList<>();
                        while (rs.next()) {
                            Map<String, Object> m = new HashMap<>();
                            m.put("id", rs.getString("id"));
                            m.put("farmerName", rs.getString("farmer_name"));
                            m.put("crop", rs.getString("crop"));
                            m.put("amount", rs.getDouble("amount"));
                            m.put("date", rs.getString("date"));
                            m.put("status", rs.getString("status"));
                            list.add(m);
                        }
                        ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(list));
                    }
                }
            } else if (path.equals("/api/payouts") && method.equals("POST")) {
                JsonObject body = ServiceUtils.readBody(exchange);
                String id = "pay_" + UUID.randomUUID().toString().substring(0, 8);
                try (Connection conn = DbManager.getInstance().getConnection()) {
                    String sql = "INSERT INTO payouts (id, farmer_name, crop, amount, status, center_id) VALUES (?,?,?,?,?,?)";
                    try (PreparedStatement ps = conn.prepareStatement(sql)) {
                        ps.setString(1, id);
                        ps.setString(2, body.has("farmer_name") ? body.get("farmer_name").getAsString() : "");
                        ps.setString(3, body.has("crop") ? body.get("crop").getAsString() : "");
                        ps.setDouble(4, body.has("amount") ? body.get("amount").getAsDouble() : 0);
                        ps.setString(5, "pending");
                        ps.setString(6, body.has("center_id") ? body.get("center_id").getAsString() : null);
                        ps.executeUpdate();
                    }
                    Map<String, Object> r = new HashMap<>(); r.put("id", id);
                    ServiceUtils.sendJson(exchange, 201, ServiceUtils.success(r));
                }
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Server error: " + e.getMessage()));
        }
    }
}
