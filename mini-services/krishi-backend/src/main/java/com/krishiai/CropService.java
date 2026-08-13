package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.sql.*;
import java.util.*;

public class CropService implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if (method.equals("OPTIONS")) { ServiceUtils.sendCors(exchange); return; }

        try {
            if (path.equals("/api/crops") && method.equals("GET")) {
                handleGetCrops(exchange);
            } else if (path.equals("/api/crops") && method.equals("POST")) {
                handleCreateCrop(exchange);
            } else if (path.startsWith("/api/crops/") && method.equals("GET")) {
                String cropId = ServiceUtils.extractIdFromPath(path, "/api/crops/");
                handleGetCrop(exchange, cropId);
            } else if (path.startsWith("/api/crops/") && method.equals("PUT")) {
                String cropId = ServiceUtils.extractIdFromPath(path, "/api/crops/");
                handleUpdateCrop(exchange, cropId);
            } else if (path.startsWith("/api/crops/") && method.equals("DELETE")) {
                String cropId = ServiceUtils.extractIdFromPath(path, "/api/crops/");
                handleDeleteCrop(exchange, cropId);
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Route not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Internal server error"));
        }
    }

    private void handleGetCrops(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        Map<String, String> queryParams = ServiceUtils.parseQueryParams(exchange.getRequestURI().getQuery());
        try (Connection conn = DbManager.getInstance().getConnection()) {
            String sql;
            PreparedStatement ps;
            if (queryParams.containsKey("farm_id")) {
                sql = "SELECT * FROM crops WHERE farm_id = ? ORDER BY created_at DESC";
                ps = conn.prepareStatement(sql);
                ps.setString(1, queryParams.get("farm_id"));
            } else {
                sql = "SELECT * FROM crops ORDER BY created_at DESC";
                ps = conn.prepareStatement(sql);
            }

            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> crops = new ArrayList<>();
            while (rs.next()) {
                crops.add(ServiceUtils.cropFromResultSet(rs));
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(crops));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleGetCrop(HttpExchange exchange, String cropId) throws IOException {
        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM crops WHERE id = ?")) {
            ps.setString(1, cropId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(ServiceUtils.cropFromResultSet(rs)));
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Crop not found"));
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleCreateCrop(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        String cropId = "crop" + UUID.randomUUID().toString().substring(0, 8);

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement(
                 "INSERT INTO crops (id, farm_id, name, name_local, icon, stage, health, planted_date, expected_harvest_date, days_to_harvest, acres, variety, expected_yield, expected_revenue) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)")) {
            ps.setString(1, cropId);
            ps.setString(2, body.has("farmId") ? body.get("farmId").getAsString() : "");
            ps.setString(3, body.has("name") ? body.get("name").getAsString() : "New Crop");
            ps.setString(4, body.has("nameLocal") ? body.get("nameLocal").getAsString() : null);
            ps.setString(5, body.has("icon") ? body.get("icon").getAsString() : "🌱");
            ps.setString(6, body.has("stage") ? body.get("stage").getAsString() : "planting");
            ps.setString(7, body.has("health") ? body.get("health").getAsString() : "healthy");
            ps.setString(8, body.has("plantedDate") ? body.get("plantedDate").getAsString() : null);
            ps.setString(9, body.has("expectedHarvestDate") ? body.get("expectedHarvestDate").getAsString() : null);
            ps.setInt(10, body.has("daysToHarvest") ? body.get("daysToHarvest").getAsInt() : 0);
            ps.setDouble(11, body.has("acres") ? body.get("acres").getAsDouble() : 0);
            ps.setString(12, body.has("variety") ? body.get("variety").getAsString() : null);
            ps.setDouble(13, body.has("expectedYield") ? body.get("expectedYield").getAsDouble() : 0);
            ps.setDouble(14, body.has("expectedRevenue") ? body.get("expectedRevenue").getAsDouble() : 0);
            ps.executeUpdate();

            try (PreparedStatement selPs = conn.prepareStatement("SELECT * FROM crops WHERE id = ?")) {
                selPs.setString(1, cropId);
                ResultSet rs = selPs.executeQuery();
                if (rs.next()) {
                    ServiceUtils.sendJson(exchange, 201, ServiceUtils.success(ServiceUtils.cropFromResultSet(rs)));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleUpdateCrop(HttpExchange exchange, String cropId) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        try (Connection conn = DbManager.getInstance().getConnection()) {
            StringBuilder sql = new StringBuilder("UPDATE crops SET ");
            List<Object> params = new ArrayList<>();

            if (body.has("name")) { sql.append("name = ?, "); params.add(body.get("name").getAsString()); }
            if (body.has("nameLocal")) { sql.append("name_local = ?, "); params.add(body.get("nameLocal").getAsString()); }
            if (body.has("icon")) { sql.append("icon = ?, "); params.add(body.get("icon").getAsString()); }
            if (body.has("stage")) { sql.append("stage = ?, "); params.add(body.get("stage").getAsString()); }
            if (body.has("health")) { sql.append("health = ?, "); params.add(body.get("health").getAsString()); }
            if (body.has("plantedDate")) { sql.append("planted_date = ?, "); params.add(body.get("plantedDate").getAsString()); }
            if (body.has("expectedHarvestDate")) { sql.append("expected_harvest_date = ?, "); params.add(body.get("expectedHarvestDate").getAsString()); }
            if (body.has("daysToHarvest")) { sql.append("days_to_harvest = ?, "); params.add(body.get("daysToHarvest").getAsInt()); }
            if (body.has("acres")) { sql.append("acres = ?, "); params.add(body.get("acres").getAsDouble()); }
            if (body.has("variety")) { sql.append("variety = ?, "); params.add(body.get("variety").getAsString()); }
            if (body.has("expectedYield")) { sql.append("expected_yield = ?, "); params.add(body.get("expectedYield").getAsDouble()); }
            if (body.has("expectedRevenue")) { sql.append("expected_revenue = ?, "); params.add(body.get("expectedRevenue").getAsDouble()); }

            if (params.isEmpty()) {
                ServiceUtils.sendJson(exchange, 400, ServiceUtils.error("No fields to update"));
                return;
            }

            String sqlStr = sql.toString().replaceAll(", $", "") + " WHERE id = ?";
            params.add(cropId);

            try (PreparedStatement ps = conn.prepareStatement(sqlStr)) {
                for (int i = 0; i < params.size(); i++) {
                    Object val = params.get(i);
                    if (val instanceof Double) ps.setDouble(i + 1, (Double) val);
                    else if (val instanceof Integer) ps.setInt(i + 1, (Integer) val);
                    else ps.setString(i + 1, val.toString());
                }
                ps.executeUpdate();
            }

            try (PreparedStatement selPs = conn.prepareStatement("SELECT * FROM crops WHERE id = ?")) {
                selPs.setString(1, cropId);
                ResultSet rs = selPs.executeQuery();
                if (rs.next()) {
                    ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(ServiceUtils.cropFromResultSet(rs)));
                } else {
                    ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Crop not found"));
                }
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleDeleteCrop(HttpExchange exchange, String cropId) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("DELETE FROM crops WHERE id = ?")) {
            ps.setString(1, cropId);
            int rows = ps.executeUpdate();
            if (rows > 0) {
                ServiceUtils.sendJson(exchange, 200, ServiceUtils.success("Crop deleted"));
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Crop not found"));
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }
}
