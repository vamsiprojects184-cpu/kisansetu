package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.sql.*;
import java.util.*;

public class FarmService implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if (method.equals("OPTIONS")) { ServiceUtils.sendCors(exchange); return; }

        try {
            if (path.equals("/api/farms") && method.equals("GET")) {
                handleGetFarms(exchange);
            } else if (path.equals("/api/farms") && method.equals("POST")) {
                handleCreateFarm(exchange);
            } else if (path.startsWith("/api/farms/") && method.equals("GET")) {
                String farmId = ServiceUtils.extractIdFromPath(path, "/api/farms/");
                handleGetFarm(exchange, farmId);
            } else if (path.startsWith("/api/farms/") && method.equals("PUT")) {
                String farmId = ServiceUtils.extractIdFromPath(path, "/api/farms/");
                handleUpdateFarm(exchange, farmId);
            } else if (path.startsWith("/api/farms/") && method.equals("DELETE")) {
                String farmId = ServiceUtils.extractIdFromPath(path, "/api/farms/");
                handleDeleteFarm(exchange, farmId);
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Route not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Internal server error"));
        }
    }

    private void handleGetFarms(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        Map<String, String> queryParams = ServiceUtils.parseQueryParams(exchange.getRequestURI().getQuery());
        try (Connection conn = DbManager.getInstance().getConnection()) {
            String sql;
            PreparedStatement ps;
            if (queryParams.containsKey("farmer_id")) {
                sql = "SELECT * FROM farms WHERE farmer_id = ? ORDER BY created_at DESC";
                ps = conn.prepareStatement(sql);
                ps.setString(1, queryParams.get("farmer_id"));
            } else {
                sql = "SELECT * FROM farms ORDER BY created_at DESC";
                ps = conn.prepareStatement(sql);
            }

            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> farms = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> farm = ServiceUtils.farmFromResultSet(rs);
                // Fetch crops for this farm
                farm.put("activeCrops", getCropsForFarm(conn, farm.get("id").toString()));
                farms.add(farm);
            }
            ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(farms));
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private List<Map<String, Object>> getCropsForFarm(Connection conn, String farmId) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM crops WHERE farm_id = ?")) {
            ps.setString(1, farmId);
            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> crops = new ArrayList<>();
            while (rs.next()) {
                crops.add(ServiceUtils.cropFromResultSet(rs));
            }
            return crops;
        }
    }

    private void handleGetFarm(HttpExchange exchange, String farmId) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM farms WHERE id = ?")) {
            ps.setString(1, farmId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Map<String, Object> farm = ServiceUtils.farmFromResultSet(rs);
                farm.put("activeCrops", getCropsForFarm(conn, farmId));
                ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(farm));
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Farm not found"));
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleCreateFarm(HttpExchange exchange) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        String farmId = "farm" + UUID.randomUUID().toString().substring(0, 8);

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement(
                 "INSERT INTO farms (id, farmer_id, name, location, state, district, village, total_acres, irrigation_available, soil_type, soil_health_score) VALUES (?,?,?,?,?,?,?,?,?,?,?)")) {
            ps.setString(1, farmId);
            ps.setString(2, body.has("farmerId") ? body.get("farmerId").getAsString() : userId);
            ps.setString(3, body.has("name") ? body.get("name").getAsString() : "My Farm");
            ps.setString(4, body.has("location") ? body.get("location").getAsString() : null);
            ps.setString(5, body.has("state") ? body.get("state").getAsString() : null);
            ps.setString(6, body.has("district") ? body.get("district").getAsString() : null);
            ps.setString(7, body.has("village") ? body.get("village").getAsString() : null);
            ps.setDouble(8, body.has("totalAcres") ? body.get("totalAcres").getAsDouble() : 0);
            ps.setInt(9, body.has("irrigationAvailable") && body.get("irrigationAvailable").getAsBoolean() ? 1 : 0);
            ps.setString(10, body.has("soilType") ? body.get("soilType").getAsString() : null);
            ps.setInt(11, body.has("soilHealthScore") ? body.get("soilHealthScore").getAsInt() : 0);
            ps.executeUpdate();

            try (PreparedStatement selPs = conn.prepareStatement("SELECT * FROM farms WHERE id = ?")) {
                selPs.setString(1, farmId);
                ResultSet rs = selPs.executeQuery();
                if (rs.next()) {
                    Map<String, Object> farm = ServiceUtils.farmFromResultSet(rs);
                    farm.put("activeCrops", new ArrayList<>());
                    ServiceUtils.sendJson(exchange, 201, ServiceUtils.success(farm));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleUpdateFarm(HttpExchange exchange, String farmId) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        JsonObject body = ServiceUtils.readBody(exchange);
        try (Connection conn = DbManager.getInstance().getConnection()) {
            StringBuilder sql = new StringBuilder("UPDATE farms SET ");
            List<Object> params = new ArrayList<>();

            if (body.has("name")) { sql.append("name = ?, "); params.add(body.get("name").getAsString()); }
            if (body.has("location")) { sql.append("location = ?, "); params.add(body.get("location").getAsString()); }
            if (body.has("state")) { sql.append("state = ?, "); params.add(body.get("state").getAsString()); }
            if (body.has("district")) { sql.append("district = ?, "); params.add(body.get("district").getAsString()); }
            if (body.has("village")) { sql.append("village = ?, "); params.add(body.get("village").getAsString()); }
            if (body.has("totalAcres")) { sql.append("total_acres = ?, "); params.add(body.get("totalAcres").getAsDouble()); }
            if (body.has("irrigationAvailable")) { sql.append("irrigation_available = ?, "); params.add(body.get("irrigationAvailable").getAsBoolean() ? 1 : 0); }
            if (body.has("soilType")) { sql.append("soil_type = ?, "); params.add(body.get("soilType").getAsString()); }
            if (body.has("soilHealthScore")) { sql.append("soil_health_score = ?, "); params.add(body.get("soilHealthScore").getAsInt()); }

            if (params.isEmpty()) {
                ServiceUtils.sendJson(exchange, 400, ServiceUtils.error("No fields to update"));
                return;
            }

            String sqlStr = sql.toString().replaceAll(", $", "") + " WHERE id = ?";
            params.add(farmId);

            try (PreparedStatement ps = conn.prepareStatement(sqlStr)) {
                for (int i = 0; i < params.size(); i++) {
                    Object val = params.get(i);
                    if (val instanceof Double) ps.setDouble(i + 1, (Double) val);
                    else if (val instanceof Integer) ps.setInt(i + 1, (Integer) val);
                    else ps.setString(i + 1, val.toString());
                }
                ps.executeUpdate();
            }

            try (PreparedStatement selPs = conn.prepareStatement("SELECT * FROM farms WHERE id = ?")) {
                selPs.setString(1, farmId);
                ResultSet rs = selPs.executeQuery();
                if (rs.next()) {
                    Map<String, Object> farm = ServiceUtils.farmFromResultSet(rs);
                    farm.put("activeCrops", getCropsForFarm(conn, farmId));
                    ServiceUtils.sendJson(exchange, 200, ServiceUtils.success(farm));
                } else {
                    ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Farm not found"));
                }
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }

    private void handleDeleteFarm(HttpExchange exchange, String farmId) throws IOException {
        String userId = AuthService.validateAuth(exchange);
        if (userId == null) { ServiceUtils.sendJson(exchange, 401, ServiceUtils.error("Unauthorized")); return; }

        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement("DELETE FROM farms WHERE id = ?")) {
            ps.setString(1, farmId);
            int rows = ps.executeUpdate();
            if (rows > 0) {
                ServiceUtils.sendJson(exchange, 200, ServiceUtils.success("Farm deleted"));
            } else {
                ServiceUtils.sendJson(exchange, 404, ServiceUtils.error("Farm not found"));
            }
        } catch (SQLException e) {
            ServiceUtils.sendJson(exchange, 500, ServiceUtils.error("Database error"));
        }
    }
}
