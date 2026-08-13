package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.*;
import java.sql.*;
import java.util.*;

public class ActivityService implements HttpHandler {
    private static final Gson gson = new Gson();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();
        if (method.equals("OPTIONS")) { ServiceUtils.sendCors(exchange); return; }

        try {
            String userId = AuthService.validateAuth(exchange);
            if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

            if (path.equals("/api/activities") && method.equals("GET")) {
                try (Connection conn = DbManager.getInstance().getConnection()) {
                    String sql = "SELECT * FROM activities WHERE user_id = ? ORDER BY date DESC LIMIT 50";
                    try (PreparedStatement ps = conn.prepareStatement(sql)) {
                        ps.setString(1, userId);
                        ResultSet rs = ps.executeQuery();
                        List<Map<String, Object>> list = new ArrayList<>();
                        while (rs.next()) {
                            Map<String, Object> m = new HashMap<>();
                            m.put("id", rs.getString("id"));
                            m.put("type", rs.getString("type"));
                            m.put("title", rs.getString("title"));
                            m.put("description", rs.getString("description"));
                            m.put("date", rs.getString("date"));
                            list.add(m);
                        }
                        ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(list));
                    }
                }
            } else if (path.equals("/api/activities") && method.equals("POST")) {
                JsonObject body = ServiceUtils.readBody(exchange);
                String id = "act_" + UUID.randomUUID().toString().substring(0, 8);
                try (Connection conn = DbManager.getInstance().getConnection()) {
                    String sql = "INSERT INTO activities (id, user_id, farm_id, type, title, description) VALUES (?,?,?,?,?,?)";
                    try (PreparedStatement ps = conn.prepareStatement(sql)) {
                        ps.setString(1, id); ps.setString(2, userId);
                        ps.setString(3, body.has("farm_id") ? body.get("farm_id").getAsString() : null);
                        ps.setString(4, body.has("type") ? body.get("type").getAsString() : "general");
                        ps.setString(5, body.has("title") ? body.get("title").getAsString() : "");
                        ps.setString(6, body.has("description") ? body.get("description").getAsString() : "");
                        ps.executeUpdate();
                    }
                    Map<String, Object> result = new HashMap<>();
                    result.put("id", id);
                    ServiceUtils.sendJson(exchange, 201, ServiceUtils.success(result));
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
