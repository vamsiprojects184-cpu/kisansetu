package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.sql.*;
import java.util.*;

public class CollectionCenterService implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if (method.equals("OPTIONS")) { ServiceUtils.sendCors(exchange); return; }

        try {
            if (path.equals("/api/collection-centers") && method.equals("GET")) {
                handleGetCenters(exchange);
            } else if (path.equals("/api/collection-centers") && method.equals("POST")) {
                handleCreateCenter(exchange);
            } else if (path.startsWith("/api/collection-centers/") && method.equals("GET")) {
                String centerId = ServiceUtils.extractIdFromPath(path, "/api/collection-centers/");
                handleGetCenter(exchange, centerId);
            } else if (path.startsWith("/api/collection-centers/") && method.equals("PUT")) {
                String centerId = ServiceUtils.extractIdFromPath(path, "/api/collection-centers/");
                handleUpdateCenter(exchange, centerId);
            } else if (path.equals("/api/quality-checks") && method.equals("GET")) {
                handleGetQualityChecks(exchange);
            } else if (path.equals("/api/quality-checks") && method.equals("POST")) {
                handleCreateQualityCheck(exchange);
            } else if (path.startsWith("/api/quality-checks/") && method.equals("PUT")) {
                String qcId = ServiceUtils.extractIdFromPath(path, "/api/quality-checks/");
                handleUpdateQualityCheck(exchange, qcId);
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Route not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Internal server error"));
        }
    }

    // ==================== COLLECTION CENTERS ====================

    private void handleGetCenters(HttpExchange exchange) throws IOException {
        try (Connection conn = DbManager.getInstance().getConnection();
             Statement stmt = conn.createStatement()) {
            ResultSet rs = stmt.executeQuery("SELECT * FROM collection_centers ORDER BY distance ASC");
            List<Map<String, Object>> centers = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> center = new LinkedHashMap<>();
                center.put("id", rs.getString("id"));
                center.put("name", rs.getString("name"));
                center.put("address", rs.getString("address"));
                center.put("distance", rs.getDouble("distance"));
                center.put("isOpen", rs.getInt("is_open") == 1);
                center.put("acceptedCrops", ServiceUtils.parseJsonArray(ServiceUtils.getGson().fromJson(rs.getString("accepted_crops_json"), com.google.gson.JsonElement.class)));
                center.put("operatingHours", rs.getString("operating_hours"));
                center.put("currentCapacity", rs.getInt("current_capacity"));
                center.put("maxCapacity", rs.getInt("max_capacity"));
                center.put("phone", rs.getString("phone"));
                centers.add(center);
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(centers));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleGetCenter(HttpExchange exchange, String centerId) throws IOException {
        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM collection_centers WHERE id = ?")) {
            ps.setString(1, centerId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Map<String, Object> center = new LinkedHashMap<>();
                center.put("id", rs.getString("id"));
                center.put("name", rs.getString("name"));
                center.put("address", rs.getString("address"));
                center.put("distance", rs.getDouble("distance"));
                center.put("isOpen", rs.getInt("is_open") == 1);
                center.put("acceptedCrops", ServiceUtils.parseJsonArray(ServiceUtils.getGson().fromJson(rs.getString("accepted_crops_json"), com.google.gson.JsonElement.class)));
                center.put("operatingHours", rs.getString("operating_hours"));
                center.put("currentCapacity", rs.getInt("current_capacity"));
                center.put("maxCapacity", rs.getInt("max_capacity"));
                center.put("phone", rs.getString("phone"));
                ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(center));
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Collection center not found"));
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleCreateCenter(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        String centerId = "cc" + UUID.randomUUID().toString().substring(0, 8);

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement(
                 "INSERT INTO collection_centers (id, name, address, distance, is_open, accepted_crops_json, operating_hours, current_capacity, max_capacity, phone) VALUES (?,?,?,?,?,?,?,?,?,?)")) {
            ps.setString(1, centerId);
            ps.setString(2, body.has("name") ? body.get("name").getAsString() : null);
            ps.setString(3, body.has("address") ? body.get("address").getAsString() : null);
            ps.setDouble(4, body.has("distance") ? body.get("distance").getAsDouble() : 0);
            ps.setInt(5, body.has("isOpen") ? (body.get("isOpen").getAsBoolean() ? 1 : 0) : 1);
            ps.setString(6, body.has("acceptedCrops") ? ServiceUtils.listToJson(ServiceUtils.parseJsonArray(body.get("acceptedCrops"))) : "[]");
            ps.setString(7, body.has("operatingHours") ? body.get("operatingHours").getAsString() : null);
            ps.setInt(8, body.has("currentCapacity") ? body.get("currentCapacity").getAsInt() : 0);
            ps.setInt(9, body.has("maxCapacity") ? body.get("maxCapacity").getAsInt() : 100);
            ps.setString(10, body.has("phone") ? body.get("phone").getAsString() : null);
            ps.executeUpdate();

            try (PreparedStatement selPs = conn.prepareStatement("SELECT * FROM collection_centers WHERE id = ?")) {
                selPs.setString(1, centerId);
                ResultSet rs = selPs.executeQuery();
                if (rs.next()) {
                    ServiceUtils.sendJson(exchange, 201, ServiceUtils.success("Collection center created"));
                }
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleUpdateCenter(HttpExchange exchange, String centerId) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        try (Connection conn = DbManager.getInstance().getConnection()) {
            StringBuilder sql = new StringBuilder("UPDATE collection_centers SET ");
            List<Object> params = new ArrayList<>();

            if (body.has("name")) { sql.append("name = ?, "); params.add(body.get("name").getAsString()); }
            if (body.has("address")) { sql.append("address = ?, "); params.add(body.get("address").getAsString()); }
            if (body.has("distance")) { sql.append("distance = ?, "); params.add(body.get("distance").getAsDouble()); }
            if (body.has("isOpen")) { sql.append("is_open = ?, "); params.add(body.get("isOpen").getAsBoolean() ? 1 : 0); }
            if (body.has("acceptedCrops")) { sql.append("accepted_crops_json = ?, "); params.add(ServiceUtils.listToJson(ServiceUtils.parseJsonArray(body.get("acceptedCrops")))); }
            if (body.has("operatingHours")) { sql.append("operating_hours = ?, "); params.add(body.get("operatingHours").getAsString()); }
            if (body.has("currentCapacity")) { sql.append("current_capacity = ?, "); params.add(body.get("currentCapacity").getAsInt()); }
            if (body.has("maxCapacity")) { sql.append("max_capacity = ?, "); params.add(body.get("maxCapacity").getAsInt()); }
            if (body.has("phone")) { sql.append("phone = ?, "); params.add(body.get("phone").getAsString()); }

            if (params.isEmpty()) {
                ServiceUtils.sendJson(exchange, 400, ServiceUtils.error("No fields to update"));
                return;
            }

            String sqlStr = sql.toString().replaceAll(", $", "") + " WHERE id = ?";
            params.add(centerId);

            try (PreparedStatement ps = conn.prepareStatement(sqlStr)) {
                for (int i = 0; i < params.size(); i++) {
                    Object val = params.get(i);
                    if (val instanceof Double) ps.setDouble(i + 1, (Double) val);
                    else if (val instanceof Integer) ps.setInt(i + 1, (Integer) val);
                    else ps.setString(i + 1, val.toString());
                }
                ps.executeUpdate();
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success("Collection center updated"));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    // ==================== QUALITY CHECKS ====================

    private void handleGetQualityChecks(HttpExchange exchange) throws IOException {
        Map<String, String> queryParams = ServiceUtils.parseQueryParams(exchange.getRequestURI().getQuery());
        try (Connection conn = DbManager.getInstance().getConnection()) {
            String sql;
            PreparedStatement ps;
            if (queryParams.containsKey("center_id")) {
                sql = "SELECT * FROM quality_checks WHERE center_id = ? ORDER BY verified_at DESC";
                ps = conn.prepareStatement(sql);
                ps.setString(1, queryParams.get("center_id"));
            } else if (queryParams.containsKey("status")) {
                sql = "SELECT * FROM quality_checks WHERE status = ? ORDER BY verified_at DESC";
                ps = conn.prepareStatement(sql);
                ps.setString(1, queryParams.get("status"));
            } else {
                sql = "SELECT * FROM quality_checks ORDER BY verified_at DESC";
                ps = conn.prepareStatement(sql);
            }

            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> checks = new ArrayList<>();
            while (rs.next()) {
                checks.add(qualityCheckFromResultSet(rs));
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(checks));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleCreateQualityCheck(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        String qcId = "qc" + UUID.randomUUID().toString().substring(0, 8);

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement(
                 "INSERT INTO quality_checks (id, product_name, farmer_name, quality_score, grade, freshness, size_consistency, appearance, damage_check, status, verified_at, center_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")) {
            ps.setString(1, qcId);
            ps.setString(2, body.has("productName") ? body.get("productName").getAsString() : null);
            ps.setString(3, body.has("farmerName") ? body.get("farmerName").getAsString() : null);
            ps.setInt(4, body.has("qualityScore") ? body.get("qualityScore").getAsInt() : 0);
            ps.setString(5, body.has("grade") ? body.get("grade").getAsString() : "standard");
            ps.setInt(6, body.has("freshness") ? body.get("freshness").getAsInt() : 0);
            ps.setInt(7, body.has("sizeConsistency") ? body.get("sizeConsistency").getAsInt() : 0);
            ps.setInt(8, body.has("appearance") ? body.get("appearance").getAsInt() : 0);
            ps.setInt(9, body.has("damageCheck") ? body.get("damageCheck").getAsInt() : 0);
            ps.setString(10, body.has("status") ? body.get("status").getAsString() : "pending");
            ps.setString(11, body.has("verifiedAt") ? body.get("verifiedAt").getAsString() : null);
            ps.setString(12, body.has("centerId") ? body.get("centerId").getAsString() : null);
            ps.executeUpdate();

            try (PreparedStatement selPs = conn.prepareStatement("SELECT * FROM quality_checks WHERE id = ?")) {
                selPs.setString(1, qcId);
                ResultSet rs = selPs.executeQuery();
                if (rs.next()) {
                    ServiceUtils.sendJson(exchange, 201, ServiceUtils.success(qualityCheckFromResultSet(rs)));
                }
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleUpdateQualityCheck(HttpExchange exchange, String qcId) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        try (Connection conn = DbManager.getInstance().getConnection()) {
            StringBuilder sql = new StringBuilder("UPDATE quality_checks SET ");
            List<Object> params = new ArrayList<>();

            if (body.has("productName")) { sql.append("product_name = ?, "); params.add(body.get("productName").getAsString()); }
            if (body.has("farmerName")) { sql.append("farmer_name = ?, "); params.add(body.get("farmerName").getAsString()); }
            if (body.has("qualityScore")) { sql.append("quality_score = ?, "); params.add(body.get("qualityScore").getAsInt()); }
            if (body.has("grade")) { sql.append("grade = ?, "); params.add(body.get("grade").getAsString()); }
            if (body.has("freshness")) { sql.append("freshness = ?, "); params.add(body.get("freshness").getAsInt()); }
            if (body.has("sizeConsistency")) { sql.append("size_consistency = ?, "); params.add(body.get("sizeConsistency").getAsInt()); }
            if (body.has("appearance")) { sql.append("appearance = ?, "); params.add(body.get("appearance").getAsInt()); }
            if (body.has("damageCheck")) { sql.append("damage_check = ?, "); params.add(body.get("damageCheck").getAsInt()); }
            if (body.has("status")) { sql.append("status = ?, "); params.add(body.get("status").getAsString()); }
            if (body.has("verifiedAt")) { sql.append("verified_at = ?, "); params.add(body.get("verifiedAt").getAsString()); }

            if (params.isEmpty()) {
                ServiceUtils.sendJson(exchange, 400, ServiceUtils.error("No fields to update"));
                return;
            }

            String sqlStr = sql.toString().replaceAll(", $", "") + " WHERE id = ?";
            params.add(qcId);

            try (PreparedStatement ps = conn.prepareStatement(sqlStr)) {
                for (int i = 0; i < params.size(); i++) {
                    Object val = params.get(i);
                    if (val instanceof Integer) ps.setInt(i + 1, (Integer) val);
                    else ps.setString(i + 1, val.toString());
                }
                ps.executeUpdate();
            }

            try (PreparedStatement selPs = conn.prepareStatement("SELECT * FROM quality_checks WHERE id = ?")) {
                selPs.setString(1, qcId);
                ResultSet rs = selPs.executeQuery();
                if (rs.next()) {
                    ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(qualityCheckFromResultSet(rs)));
                } else {
                    ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Quality check not found"));
                }
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private Map<String, Object> qualityCheckFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", rs.getString("id"));
        map.put("productName", rs.getString("product_name"));
        map.put("farmerName", rs.getString("farmer_name"));
        map.put("qualityScore", rs.getInt("quality_score"));
        map.put("grade", rs.getString("grade"));
        map.put("freshness", rs.getInt("freshness"));
        map.put("sizeConsistency", rs.getInt("size_consistency"));
        map.put("appearance", rs.getInt("appearance"));
        map.put("damageCheck", rs.getInt("damage_check"));
        map.put("verifiedAt", rs.getString("verified_at"));
        map.put("status", rs.getString("status"));
        map.put("centerId", rs.getString("center_id"));
        return map;
    }
}
