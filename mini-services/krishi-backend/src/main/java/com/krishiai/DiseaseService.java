package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.sql.*;
import java.util.*;

public class DiseaseService implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if (method.equals("OPTIONS")) { ServiceUtils.sendCors(exchange); return; }

        try {
            if (path.equals("/api/disease-scans") && method.equals("GET")) {
                handleGetDiseaseScans(exchange);
            } else if (path.equals("/api/disease-scans") && method.equals("POST")) {
                handleCreateDiseaseScan(exchange);
            } else if (path.startsWith("/api/disease-scans/") && method.equals("GET")) {
                String scanId = ServiceUtils.extractIdFromPath(path, "/api/disease-scans/");
                handleGetDiseaseScan(exchange, scanId);
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Route not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Internal server error"));
        }
    }

    private void handleGetDiseaseScans(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        Map<String, String> queryParams = ServiceUtils.parseQueryParams(exchange.getRequestURI().getQuery());
        try (Connection conn = DbManager.getInstance().getConnection()) {
            String sql;
            PreparedStatement ps;
            if (queryParams.containsKey("user_id")) {
                sql = "SELECT * FROM disease_scans WHERE user_id = ? ORDER BY created_at DESC";
                ps = conn.prepareStatement(sql);
                ps.setString(1, queryParams.get("user_id"));
            } else if (queryParams.containsKey("status")) {
                sql = "SELECT * FROM disease_scans WHERE status = ? ORDER BY created_at DESC";
                ps = conn.prepareStatement(sql);
                ps.setString(1, queryParams.get("status"));
            } else {
                sql = "SELECT * FROM disease_scans ORDER BY created_at DESC";
                ps = conn.prepareStatement(sql);
            }

            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> scans = new ArrayList<>();
            while (rs.next()) {
                scans.add(diseaseScanFromResultSet(rs));
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(scans));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleGetDiseaseScan(HttpExchange exchange, String scanId) throws IOException {
        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM disease_scans WHERE id = ?")) {
            ps.setString(1, scanId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(diseaseScanFromResultSet(rs)));
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Disease scan not found"));
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleCreateDiseaseScan(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        String scanId = body.has("id") ? body.get("id").getAsString() : "d" + UUID.randomUUID().toString().substring(0, 8);

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement(
                 "INSERT INTO disease_scans (id, user_id, crop_name, disease_name, confidence, severity, description, causes_json, actions_json, prevention_json, status, needs_expert_review) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)")) {
            ps.setString(1, scanId);
            ps.setString(2, body.has("userId") ? body.get("userId").getAsString() : userId);
            ps.setString(3, body.has("cropName") ? body.get("cropName").getAsString() : null);
            ps.setString(4, body.has("diseaseName") ? body.get("diseaseName").getAsString() : null);
            ps.setDouble(5, body.has("confidence") ? body.get("confidence").getAsDouble() : 0);
            ps.setString(6, body.has("severity") ? body.get("severity").getAsString() : "moderate");
            ps.setString(7, body.has("description") ? body.get("description").getAsString() : null);
            ps.setString(8, body.has("causes") ? ServiceUtils.listToJson(ServiceUtils.parseJsonArray(body.get("causes"))) : "[]");
            ps.setString(9, body.has("recommendedActions") || body.has("actions") ? ServiceUtils.listToJson(ServiceUtils.parseJsonArray(body.has("actions") ? body.get("actions") : body.get("recommendedActions"))) : "[]");
            ps.setString(10, body.has("preventionTips") || body.has("prevention") ? ServiceUtils.listToJson(ServiceUtils.parseJsonArray(body.has("prevention") ? body.get("prevention") : body.get("preventionTips"))) : "[]");
            ps.setString(11, body.has("status") ? body.get("status").getAsString() : "completed");
            ps.setInt(12, body.has("needsExpertReview") ? (body.get("needsExpertReview").getAsBoolean() ? 1 : 0) : 0);
            ps.executeUpdate();

            try (PreparedStatement selPs = conn.prepareStatement("SELECT * FROM disease_scans WHERE id = ?")) {
                selPs.setString(1, scanId);
                ResultSet rs = selPs.executeQuery();
                if (rs.next()) {
                    ServiceUtils.sendJson(exchange, 201, ServiceUtils.success(diseaseScanFromResultSet(rs)));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private Map<String, Object> diseaseScanFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", rs.getString("id"));
        map.put("userId", rs.getString("user_id"));
        map.put("cropName", rs.getString("crop_name"));
        map.put("diseaseName", rs.getString("disease_name"));
        map.put("confidence", rs.getDouble("confidence"));
        map.put("severity", rs.getString("severity"));
        map.put("description", rs.getString("description"));
        map.put("causes", ServiceUtils.parseJsonArray(ServiceUtils.getGson().fromJson(rs.getString("causes_json"), com.google.gson.JsonElement.class)));
        map.put("recommendedActions", ServiceUtils.parseJsonArray(ServiceUtils.getGson().fromJson(rs.getString("actions_json"), com.google.gson.JsonElement.class)));
        map.put("preventionTips", ServiceUtils.parseJsonArray(ServiceUtils.getGson().fromJson(rs.getString("prevention_json"), com.google.gson.JsonElement.class)));
        map.put("status", rs.getString("status"));
        map.put("needsExpertReview", rs.getInt("needs_expert_review") == 1);
        map.put("detectedAt", rs.getString("created_at"));
        return map;
    }
}
