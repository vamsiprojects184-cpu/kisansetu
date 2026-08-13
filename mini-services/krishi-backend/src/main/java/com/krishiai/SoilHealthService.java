package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.sql.*;
import java.util.*;

public class SoilHealthService implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if (method.equals("OPTIONS")) { ServiceUtils.sendCors(exchange); return; }

        try {
            if (path.equals("/api/soil-health") && method.equals("GET")) {
                handleGetSoilHealth(exchange);
            } else if (path.equals("/api/soil-health") && method.equals("POST")) {
                handleCreateSoilHealth(exchange);
            } else if (path.startsWith("/api/soil-health/") && method.equals("GET")) {
                String healthId = ServiceUtils.extractIdFromPath(path, "/api/soil-health/");
                handleGetSoilHealthById(exchange, healthId);
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Route not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Internal server error"));
        }
    }

    private void handleGetSoilHealth(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        Map<String, String> queryParams = ServiceUtils.parseQueryParams(exchange.getRequestURI().getQuery());
        try (Connection conn = DbManager.getInstance().getConnection()) {
            String sql;
            PreparedStatement ps;
            if (queryParams.containsKey("farm_id")) {
                sql = "SELECT * FROM soil_health WHERE farm_id = ? ORDER BY last_test_date DESC";
                ps = conn.prepareStatement(sql);
                ps.setString(1, queryParams.get("farm_id"));
            } else {
                sql = "SELECT * FROM soil_health ORDER BY last_test_date DESC";
                ps = conn.prepareStatement(sql);
            }

            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> results = new ArrayList<>();
            while (rs.next()) {
                results.add(soilHealthFromResultSet(rs));
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(results));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleGetSoilHealthById(HttpExchange exchange, String healthId) throws IOException {
        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM soil_health WHERE id = ?")) {
            ps.setString(1, healthId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(soilHealthFromResultSet(rs)));
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Soil health record not found"));
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleCreateSoilHealth(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        String healthId = body.has("id") ? body.get("id").getAsString() : "sh" + UUID.randomUUID().toString().substring(0, 8);

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement(
                 "INSERT INTO soil_health (id, farm_id, score, grade, nitrogen_value, nitrogen_status, phosphorus_value, phosphorus_status, potassium_value, potassium_status, ph, organic_carbon, moisture, recommendations_json, suitable_crops_json, last_test_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")) {
            ps.setString(1, healthId);
            ps.setString(2, body.has("farmId") ? body.get("farmId").getAsString() : "");
            ps.setInt(3, body.has("score") ? body.get("score").getAsInt() : 0);
            ps.setString(4, body.has("grade") ? body.get("grade").getAsString() : "fair");
            ps.setDouble(5, body.has("nitrogen") ? body.getAsJsonObject("nitrogen").get("value").getAsDouble() : 0);
            ps.setString(6, body.has("nitrogen") ? body.getAsJsonObject("nitrogen").get("status").getAsString() : "optimal");
            ps.setDouble(7, body.has("phosphorus") ? body.getAsJsonObject("phosphorus").get("value").getAsDouble() : 0);
            ps.setString(8, body.has("phosphorus") ? body.getAsJsonObject("phosphorus").get("status").getAsString() : "optimal");
            ps.setDouble(9, body.has("potassium") ? body.getAsJsonObject("potassium").get("value").getAsDouble() : 0);
            ps.setString(10, body.has("potassium") ? body.getAsJsonObject("potassium").get("status").getAsString() : "optimal");
            ps.setDouble(11, body.has("ph") ? body.get("ph").getAsDouble() : 0);
            ps.setDouble(12, body.has("organicCarbon") ? body.get("organicCarbon").getAsDouble() : 0);
            ps.setDouble(13, body.has("moisture") ? body.get("moisture").getAsDouble() : 0);
            ps.setString(14, body.has("recommendations") ? ServiceUtils.listToJson(ServiceUtils.parseJsonArray(body.get("recommendations"))) : "[]");
            ps.setString(15, body.has("suitableCrops") ? ServiceUtils.listToJson(ServiceUtils.parseJsonArray(body.get("suitableCrops"))) : "[]");
            ps.setString(16, body.has("lastTestDate") ? body.get("lastTestDate").getAsString() : new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date()));
            ps.executeUpdate();

            try (PreparedStatement selPs = conn.prepareStatement("SELECT * FROM soil_health WHERE id = ?")) {
                selPs.setString(1, healthId);
                ResultSet rs = selPs.executeQuery();
                if (rs.next()) {
                    ServiceUtils.sendJson(exchange, 201, ServiceUtils.success(soilHealthFromResultSet(rs)));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private Map<String, Object> soilHealthFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", rs.getString("id"));
        map.put("farmId", rs.getString("farm_id"));
        map.put("score", rs.getInt("score"));
        map.put("grade", rs.getString("grade"));

        Map<String, Object> nitrogen = new LinkedHashMap<>();
        nitrogen.put("value", rs.getDouble("nitrogen_value"));
        nitrogen.put("status", rs.getString("nitrogen_status"));
        map.put("nitrogen", nitrogen);

        Map<String, Object> phosphorus = new LinkedHashMap<>();
        phosphorus.put("value", rs.getDouble("phosphorus_value"));
        phosphorus.put("status", rs.getString("phosphorus_status"));
        map.put("phosphorus", phosphorus);

        Map<String, Object> potassium = new LinkedHashMap<>();
        potassium.put("value", rs.getDouble("potassium_value"));
        potassium.put("status", rs.getString("potassium_status"));
        map.put("potassium", potassium);

        map.put("ph", rs.getDouble("ph"));
        map.put("organicCarbon", rs.getDouble("organic_carbon"));
        map.put("moisture", rs.getDouble("moisture"));
        map.put("recommendations", ServiceUtils.parseJsonArray(ServiceUtils.getGson().fromJson(rs.getString("recommendations_json"), com.google.gson.JsonElement.class)));
        map.put("suitableCrops", ServiceUtils.parseJsonArray(ServiceUtils.getGson().fromJson(rs.getString("suitable_crops_json"), com.google.gson.JsonElement.class)));
        map.put("lastTestDate", rs.getString("last_test_date"));
        return map;
    }
}
