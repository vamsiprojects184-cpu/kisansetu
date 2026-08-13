package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.*;
import java.util.*;

public class ServiceUtils {
    private static final Gson gson = new Gson();

    public static void sendJson(HttpExchange exchange, int code, String json) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type,Authorization");
        byte[] bytes = json.getBytes("UTF-8");
        exchange.sendResponseHeaders(code, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    public static void sendCors(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type,Authorization");
        exchange.sendResponseHeaders(204, -1);
    }

    public static JsonObject readBody(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        byte[] bytes = is.readAllBytes();
        is.close();
        if (bytes.length == 0) return new JsonObject();
        return JsonParser.parseString(new String(bytes)).getAsJsonObject();
    }

    public static String success(Object data) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("data", data);
        return gson.toJson(resp);
    }

    public static String error(String msg) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", false);
        resp.put("error", msg);
        return gson.toJson(resp);
    }

    public static Map<String, Object> resultSetToMap(ResultSet rs, String[] columns) throws SQLException {
        Map<String, Object> map = new LinkedHashMap<>();
        for (String col : columns) {
            Object val = rs.getObject(col);
            if (val != null) {
                map.put(col, val);
            }
        }
        return map;
    }

    public static Map<String, Object> userFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", rs.getString("id"));
        map.put("name", rs.getString("name"));
        map.put("email", rs.getString("email"));
        map.put("phone", rs.getString("phone"));
        map.put("role", rs.getString("role"));
        map.put("language", rs.getString("language"));
        map.put("state", rs.getString("state"));
        map.put("district", rs.getString("district"));
        map.put("village", rs.getString("village"));
        map.put("location", rs.getString("location"));
        map.put("isOnboarded", rs.getInt("is_onboarded") == 1);
        map.put("joinedDate", rs.getString("created_at"));
        return map;
    }

    public static Map<String, Object> farmFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", rs.getString("id"));
        map.put("farmerId", rs.getString("farmer_id"));
        map.put("name", rs.getString("name"));
        map.put("location", rs.getString("location"));
        map.put("state", rs.getString("state"));
        map.put("district", rs.getString("district"));
        map.put("village", rs.getString("village"));
        map.put("totalAcres", rs.getDouble("total_acres"));
        map.put("irrigationAvailable", rs.getInt("irrigation_available") == 1);
        map.put("soilType", rs.getString("soil_type"));
        map.put("soilHealthScore", rs.getInt("soil_health_score"));
        map.put("createdAt", rs.getString("created_at"));
        return map;
    }

    public static Map<String, Object> cropFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", rs.getString("id"));
        map.put("farmId", rs.getString("farm_id"));
        map.put("name", rs.getString("name"));
        map.put("nameLocal", rs.getString("name_local"));
        map.put("icon", rs.getString("icon"));
        map.put("stage", rs.getString("stage"));
        map.put("health", rs.getString("health"));
        map.put("plantedDate", rs.getString("planted_date"));
        map.put("expectedHarvestDate", rs.getString("expected_harvest_date"));
        map.put("daysToHarvest", rs.getInt("days_to_harvest"));
        map.put("acres", rs.getDouble("acres"));
        map.put("variety", rs.getString("variety"));
        map.put("expectedYield", rs.getDouble("expected_yield"));
        map.put("expectedRevenue", rs.getDouble("expected_revenue"));
        return map;
    }

    public static Map<String, Object> productFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", rs.getString("id"));
        map.put("name", rs.getString("name"));
        map.put("category", rs.getString("category"));
        map.put("price", rs.getDouble("price"));
        map.put("unit", rs.getString("unit"));
        map.put("rating", rs.getDouble("rating"));
        map.put("reviewCount", rs.getInt("review_count"));
        map.put("farmerId", rs.getString("farmer_id"));
        map.put("farmer", rs.getString("farmer_name"));
        map.put("farmerLocation", rs.getString("farmer_location"));
        map.put("qualityScore", rs.getInt("quality_score"));
        map.put("harvestDate", rs.getString("harvest_date"));
        map.put("inStock", rs.getInt("in_stock") == 1);
        map.put("isCertified", rs.getInt("is_certified") == 1);
        map.put("germination", rs.getString("germination"));
        map.put("description", rs.getString("description"));
        map.put("imageUrl", rs.getString("image_url"));
        map.put("createdAt", rs.getString("created_at"));
        return map;
    }

    public static Map<String, Object> orderFromResultSet(ResultSet rs) throws SQLException {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", rs.getString("id"));
        map.put("userId", rs.getString("user_id"));
        map.put("itemsJson", rs.getString("items_json"));
        map.put("total", rs.getDouble("total"));
        map.put("status", rs.getString("status"));
        map.put("deliveryAddress", rs.getString("delivery_address"));
        map.put("deliveryMethod", rs.getString("delivery_method"));
        map.put("paymentMethod", rs.getString("payment_method"));
        map.put("estimatedDelivery", rs.getString("estimated_delivery"));
        map.put("createdAt", rs.getString("created_at"));
        return map;
    }

    public static List<Map<String, Object>> queryToList(String sql, String... params) throws SQLException {
        List<Map<String, Object>> list = new ArrayList<>();
        try (Connection conn = DbManager.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            for (int i = 0; i < params.length; i++) {
                ps.setString(i + 1, params[i]);
            }
            try (ResultSet rs = ps.executeQuery()) {
                ResultSetMetaData md = rs.getMetaData();
                int colCount = md.getColumnCount();
                while (rs.next()) {
                    Map<String, Object> row = new LinkedHashMap<>();
                    for (int i = 1; i <= colCount; i++) {
                        row.put(md.getColumnLabel(i), rs.getObject(i));
                    }
                    list.add(row);
                }
            }
        }
        return list;
    }

    public static String extractIdFromPath(String path, String prefix) {
        String cleanPath = path.replace(prefix, "");
        // Handle /api/farms/ with trailing or no slash
        if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
        return cleanPath;
    }

    public static Map<String, String> parseQueryParams(String query) {
        Map<String, String> params = new HashMap<>();
        if (query == null || query.isEmpty()) return params;
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            String[] kv = pair.split("=", 2);
            if (kv.length == 2) {
                params.put(kv[0], java.net.URLDecoder.decode(kv[1], java.nio.charset.StandardCharsets.UTF_8));
            } else if (kv.length == 1) {
                params.put(kv[0], "");
            }
        }
        return params;
    }

    public static List<String> parseJsonArray(JsonElement element) {
        if (element == null || element.isJsonNull()) return new ArrayList<>();
        return gson.fromJson(element, new TypeToken<List<String>>(){}.getType());
    }

    public static String listToJson(List<String> list) {
        return gson.toJson(list);
    }

    public static Gson getGson() {
        return gson;
    }
}
