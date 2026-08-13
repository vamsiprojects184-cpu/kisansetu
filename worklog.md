# KrishiAI - AI-Powered Agriculture Platform

## Current Status
- **Phase**: Full-stack build with Java backend + Next.js frontend
- **Backend**: Java 21 (HttpServer + SQLite + Gson) running on port 8080
- **Frontend**: Next.js 16 with client-side SPA routing, connected via API proxy
- **Database**: Real SQLite with 15 tables, seed data for all entities
- **Authentication**: Real login/register with SHA-256 hashed passwords, JWT-like token sessions
- **Dev Server**: Compiling and serving pages, API proxy routes working

## Completed This Session

### Java Backend (mini-services/krishi-backend/)
- 15 Java source files compiled successfully
- 50+ REST API endpoints across 10 service classes
- Real SQLite database with 15 tables (users, farms, crops, products, orders, cart_items, collection_centers, quality_checks, soil_health, disease_scans, notifications, chat_messages, market_prices, payouts, activities)
- Seed data: 5 users (all with password `demo123`), 2 farms, 3 crops, 18 products, 4 collection centers, 8 market prices, 5 notifications, quality checks, payouts
- Thread pool executor (20 threads) for concurrent request handling
- Auto-restart run.sh script
- Fixed: register SQL column count bug, removed root catch-all context
- Added: ActivityService, PayoutService, AdminService

### Frontend API Layer (src/services/api.ts)
- Complete TypeScript API service with 30+ methods
- Token management with localStorage persistence
- Fetch helper with auth header injection
- Covers: auth, farms, crops, products, orders, cart, market, collection centers, notifications, soil health, disease, chat, admin, quality checks, payouts, activities

### Next.js API Proxy (src/app/api/backend/[...path]/route.ts)
- Catches all /api/backend/* requests and proxies to Java backend on port 8080
- Supports GET, POST, PUT, DELETE methods
- CORS headers
- Graceful 503 error when backend is unavailable

### Auth System Updates
- useAuthStore now uses real API calls (apiLogin, apiRegister)
- Falls back to mock data when backend is down
- Password fields added to login and register forms
- Error display for failed login/registration
- Session restore capability (restoreSession method)

### Login Credentials (all passwords: demo123)
- Farmer: vamsi@farm.ai
- Consumer: priya@gmail.com
- Collection Center: rajesh@greenagri.in
- Expert: anitha@agri-expert.in
- Admin: admin@krishiai.com

## Verification Results
- ✅ Landing page renders correctly
- ✅ Login with demo buttons works (with fallback to mock data)
- ✅ Farmer dashboard loads with weather, soil, crops, market prices
- ✅ API proxy routes working (503 when backend down is expected)
- ✅ Registration form now has password field
- ✅ All lint checks pass
- ✅ Dev server compiling without errors

## Issues & Notes
- Java backend has stability issues in sandbox environment (process killed by sandbox)
- Backend needs to be restarted via `cd mini-services/krishi-backend && nohup bash run.sh > /tmp/java-backend.log 2>&1 & disown`
- The auto-restart run.sh helps maintain availability
- Frontend gracefully degrades when backend is unavailable
- API proxy returns proper 503 errors when Java backend is down

## Next Phase Recommendations
1. **Wire marketplace pages to real API** (products, cart, checkout, orders)
2. **Wire farmer pages to real API** (farms, crops, soil health, notifications)
3. **Wire admin pages to real API** (users, stats, analytics)
4. **Add real-time cart sync** with backend (cart_items table)
5. **Add real order creation flow** (POST /api/orders)
6. **Add disease scan creation** (POST /api/disease-scans)
7. **Add chat integration** (POST /api/chat with keyword-based AI responses)
8. **Improve Java backend stability** (connection pooling, better error handling)
9. **Add more seed data** for a richer demo experience
10. **Style improvements and mobile optimization**
