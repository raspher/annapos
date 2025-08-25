# AnnaPOS — Technical Specification

Last updated: 2025-08-25

1. Technology Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express (TypeScript)
- Auth: JWT stored in httpOnly cookie (SameSite=strict; secure in prod)
- Data: Local database via migrations (not shown here), demo import from FakeStore API
- Containerization: Docker + docker-compose (dev/prod profiles)

2. Deployment Profiles
- dev profile:
  - Backend debug on port 9229
  - Frontend dev server on ${FRONTEND_PORT}
- prod profile:
  - Frontend built and served as static files by backend under root URL
  - API under /api/

3. Environment Variables
- VITE_API_BASE_URL: Frontend base URL for API (e.g., https://example.com:12345/api or /api in prod)
- JWT_SECRET: Secret key for signing tokens
- API_PORT: Port for API (e.g., 8080)
- PROFILE: DEV/PROD (affects CORS and cookie secure flag indirectly)

4. Backend Architecture
- Structure: Vertical slices per feature (auth, products, categories, orders, sync)
- Main modules:
  - routes/index.ts: mounts feature routers at /api
  - routes/*: per-feature routes
  - controllers/*: HTTP handling, parsing/validation, sending responses
  - services/*: business logic (auth, product/category listing, orders, sync)
  - middleware.ts: authenticateToken (JWT verification)

5. Authentication Flow
- POST /api/auth/login
  - Body: { email, password }
  - On success:
    - Sets httpOnly cookie token
    - Responds { user, token }
- POST /api/auth/logout (protected)
  - Clears cookie; returns { message: 'Logged out' }
- GET /api/auth/cookie (protected)
  - Returns { user, token } for session check

6. API Endpoints (current)
- Auth
  - POST /api/auth/login
  - POST /api/auth/logout
  - GET /api/auth/cookie

- Catalog
  - GET /api/categories
    - Query: q? (string)
    - Response: { items: Category[] }
  - GET /api/products
    - Query: q?, categoryId?, limit?, offset?
    - Response: { items: Product[], total: number }

- Orders
  - POST /api/orders
    - Body: { items: { productId: number; quantity: number }[] }
    - Response: Order
  - PATCH /api/orders/:id/complete
    - Response: Order
  - GET /api/orders
    - Query: limit?, offset?, status?
    - Response: { items: Order[], total: number }
  - GET /api/orders/:id
    - Response: Order
  - DELETE /api/orders/:id
    - Response: { message: string }

- Sync
  - POST /api/sync/fakestore
    - Fetches categories and products from https://fakestoreapi.com and upserts locally

7. Data Models (logical)
- Category: { id: number; name: string }
- Product: { id: number; title: string; categoryId: number; category?: Category; price: number; imageUrl?: string; ratingRate?: number; ratingCount?: number }
- OrderItem: { productId: number; quantity: number; priceAtPurchase?: number }
- Order: { id: number; createdAt: string; status: 'PENDING' | 'COMPLETED' | 'CANCELLED'; items: OrderItem[]; total?: number }
- User: { id: number; name: string; email: string }

8. Security
- JWT in httpOnly cookie with SameSite=strict, secure=true in production
- authenticateToken middleware guards all non-login routes
- Error format: { message } JSON for most failures; login 401 returns text 'Invalid credentials'

9. Frontend Architecture
- SPA with React
- Auth context (components/Auth.jsx) manages session state via AuthAPI (cookie/login/logout)
- Pages:
  - LoginPage.jsx: login form, uses useAuth().login
  - ProductsPage.jsx: products browsing, categories filter, pagination, Sync FakeStore button
- Services:
  - services/api.js: thin wrapper over fetch with credentials: 'include'
  - AuthAPI, CategoriesAPI, ProductsAPI, OrdersAPI, SyncAPI

10. Request Handling (frontend)
- All requests go to BASE_URL (VITE_API_BASE_URL || '/api')
- JSON content-type always set; body auto-serialized
- Credentials included to send/receive httpOnly cookie
- On non-OK response, throw Error(message)

11. Error Handling & Logging
- Controllers catch and log errors; return 500 { message }
- Frontend catches and displays error messages near forms or as alerts

12. Diagrams
- Component Diagram (textual):
  - Browser (React SPA)
    -> AuthAPI/CategoriesAPI/ProductsAPI/OrdersAPI/SyncAPI (fetch)
    -> Express API (/api/*)
    -> Services layer (business logic)
    -> Database (via services/repository; details omitted here)
    -> External: FakeStore API (sync)

- Sequence (Login):
  - SPA Login form -> POST /api/auth/login { email, password }
  - Express authController -> authService -> issue JWT -> set cookie -> respond JSON
  - SPA stores user/token in context

- Sequence (List Products):
  - SPA -> GET /api/products?q&categoryId&limit&offset (with cookie)
  - authenticateToken -> productController -> productService -> DB -> respond JSON { items, total }

13. Performance & Pagination
- Products and Orders endpoints support limit/offset pagination
- Frontend paginates with selectable page size (10,20,50,100)

14. Internationalization & Localization
- Not implemented in current iteration

15. Testing
- Frontend tests exist for ProductsPage and AuthAPI (see frontend/src/__tests__)
- Backend tests exist under backend/tests (not detailed here)
