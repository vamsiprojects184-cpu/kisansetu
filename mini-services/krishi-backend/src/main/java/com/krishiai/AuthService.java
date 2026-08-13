package com.krishiai;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class AuthService implements HttpHandler {
    private static final Map<String, String> sessions = new HashMap<>(); // token -> userId
    private static final Gson gson = new Gson();

    public static String getUserIdFromToken(String token) {
        if (token == null || token.isEmpty()) return null;
        return sessions.get(token.replace("Bearer ", ""));
    }

    public static String validateAuth(HttpExchange exchange) {
        String auth = exchange.getRequestHeaders().getFirst("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) return null;
        String token = auth.substring(7);
        String userId = sessions.get(token);
        if (userId == null) return null;
        return userId;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        // CORS preflight
        if (method.equals("OPTIONS")) {
            sendCors(exchange);
            return;
        }

        try {
            if (path.equals("/api/auth/login") && method.equals("POST")) {
                handleLogin(exchange);
            } else if (path.equals("/api/auth/register") && method.equals("POST")) {
                handleRegister(exchange);
            } else if (path.equals("/api/auth/profile") && method.equals("GET")) {
                handleProfile(exchange);
            } else if (path.equals("/api/auth/verify") && method.equals("GET")) {
                handleVerify(exchange);
            } else {
                sendJson(exchange, 404, error("Route not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendJson(exchange, 500, error("Internal server error: " + e.getMessage()));
        }
    }

    private void handleLogin(HttpExchange exchange) throws IOException {
        JsonObject body = readBody(exchange);
        String emailOrPhone = body.has("email_or_phone") ? body.get("email_or_phone").getAsString() : "";
        String password = body.has("password") ? body.get("password").getAsString() : "";
        String passwordHash = DbManager.sha256(password);

        try (Connection conn = DbManager.getInstance().getConnection()) {
            String sql = "SELECT * FROM users WHERE (email = ? OR phone = ?) AND password_hash = ?";
            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setString(1, emailOrPhone);
                ps.setString(2, emailOrPhone);
                ps.setString(3, passwordHash);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        String userId = rs.getString("id");
                        String token = UUID.randomUUID().toString();
                        sessions.put(token, userId);

                        Map<String, Object> user = new HashMap<>();
                        user.put("id", rs.getString("id"));
                        user.put("name", rs.getString("name"));
                        user.put("email", rs.getString("email"));
                        user.put("phone", rs.getString("phone"));
                        user.put("role", rs.getString("role"));
                        user.put("language", rs.getString("language"));
                        user.put("state", rs.getString("state"));
                        user.put("district", rs.getString("district"));
                        user.put("village", rs.getString("village"));
                        user.put("location", rs.getString("location"));
                        user.put("isOnboarded", rs.getInt("is_onboarded") == 1);
                        user.put("joinedDate", rs.getString("created_at"));

                        Map<String, Object> response = new HashMap<>();
                        response.put("token", token);
                        response.put("user", user);

                        sendJson(exchange, 200, success(response));
                    } else {
                        sendJson(exchange, 401, error("Invalid email/phone or password"));
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendJson(exchange, 500, error("Database error"));
        }
    }

    private void handleRegister(HttpExchange exchange) throws IOException {
        JsonObject body = readBody(exchange);
        String name = body.has("name") ? body.get("name").getAsString() : "";
        String email = body.has("email") ? body.get("email").getAsString() : "";
        String phone = body.has("phone") ? body.get("phone").getAsString() : "";
        String password = body.has("password") ? body.get("password").getAsString() : "";
        String role = body.has("role") ? body.get("role").getAsString() : "farmer";
        String language = body.has("language") ? body.get("language").getAsString() : "en";
        String state = body.has("state") ? body.get("state").getAsString() : null;
        String district = body.has("district") ? body.get("district").getAsString() : null;
        String village = body.has("village") ? body.get("village").getAsString() : null;

        if (name.isEmpty() || password.isEmpty()) {
            sendJson(exchange, 400, error("Name and password are required"));
            return;
        }

        String userId = "u" + UUID.randomUUID().toString().substring(0, 8);
        String passwordHash = DbManager.sha256(password);

        try (Connection conn = DbManager.getInstance().getConnection()) {
            // Check if email or phone already exists
            String checkSql = "SELECT id FROM users WHERE email = ? OR phone = ?";
            try (PreparedStatement checkPs = conn.prepareStatement(checkSql)) {
                checkPs.setString(1, email);
                checkPs.setString(2, phone);
                try (ResultSet checkRs = checkPs.executeQuery()) {
                    if (checkRs.next()) {
                        sendJson(exchange, 409, error("Email or phone already registered"));
                        return;
                    }
                }
            }

            String sql = "INSERT INTO users (id, name, email, phone, password_hash, role, language, state, district, village, location, is_onboarded) VALUES (?,?,?,?,?,?,?,?,?,?,?,0)";
            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setString(1, userId);
                ps.setString(2, name);
                ps.setString(3, email);
                ps.setString(4, phone);
                ps.setString(5, passwordHash);
                ps.setString(6, role);
                ps.setString(7, language);
                ps.setString(8, state);
                ps.setString(9, district);
                ps.setString(10, village);
                ps.setString(11, district != null ? district + ", " + (village != null ? village : "") : "");
                ps.executeUpdate();
            }

            String token = UUID.randomUUID().toString();
            sessions.put(token, userId);

            Map<String, Object> user = new HashMap<>();
            user.put("id", userId);
            user.put("name", name);
            user.put("email", email);
            user.put("phone", phone);
            user.put("role", role);
            user.put("language", language);
            user.put("state", state);
            user.put("district", district);
            user.put("village", village);
            user.put("isOnboarded", false);
            user.put("joinedDate", java.time.LocalDateTime.now().toString());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);

            sendJson(exchange, 201, success(response));
        } catch (Exception e) {
            e.printStackTrace();
            sendJson(exchange, 500, error("Database error: " + e.getMessage()));
        }
    }

    private void handleProfile(HttpExchange exchange) throws IOException {
        String userId = validateAuth(exchange);
        if (userId == null) {
            sendJson(exchange, 401, error("Unauthorized"));
            return;
        }

        try (Connection conn = DbManager.getInstance().getConnection()) {
            String sql = "SELECT * FROM users WHERE id = ?";
            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setString(1, userId);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        Map<String, Object> user = new HashMap<>();
                        user.put("id", rs.getString("id"));
                        user.put("name", rs.getString("name"));
                        user.put("email", rs.getString("email"));
                        user.put("phone", rs.getString("phone"));
                        user.put("role", rs.getString("role"));
                        user.put("language", rs.getString("language"));
                        user.put("state", rs.getString("state"));
                        user.put("district", rs.getString("district"));
                        user.put("village", rs.getString("village"));
                        user.put("location", rs.getString("location"));
                        user.put("isOnboarded", rs.getInt("is_onboarded") == 1);
                        user.put("joinedDate", rs.getString("created_at"));
                        sendJson(exchange, 200, success(user));
                    } else {
                        sendJson(exchange, 404, error("User not found"));
                    }
                }
            }
        } catch (Exception e) {
            sendJson(exchange, 500, error("Database error"));
        }
    }

    private void handleVerify(HttpExchange exchange) throws IOException {
        String userId = validateAuth(exchange);
        if (userId == null) {
            sendJson(exchange, 401, error("Invalid or expired token"));
            return;
        }

        try (Connection conn = DbManager.getInstance().getConnection()) {
            String sql = "SELECT id, role, name FROM users WHERE id = ?";
            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setString(1, userId);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        Map<String, Object> data = new HashMap<>();
                        data.put("userId", rs.getString("id"));
                        data.put("role", rs.getString("role"));
                        data.put("name", rs.getString("name"));
                        sendJson(exchange, 200, success(data));
                    } else {
                        sendJson(exchange, 401, error("User not found"));
                    }
                }
            }
        } catch (Exception e) {
            sendJson(exchange, 500, error("Database error"));
        }
    }

    private JsonObject readBody(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        byte[] bytes = is.readAllBytes();
        is.close();
        if (bytes.length == 0) return new JsonObject();
        return JsonParser.parseString(new String(bytes)).getAsJsonObject();
    }

    private void sendJson(HttpExchange exchange, int code, String json) throws IOException {
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

    private void sendCors(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type,Authorization");
        exchange.sendResponseHeaders(204, -1);
    }

    private String success(Object data) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("data", data);
        return gson.toJson(resp);
    }

    private String error(String msg) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", false);
        resp.put("error", msg);
        return gson.toJson(resp);
    }
}
