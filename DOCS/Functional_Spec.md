# AnnaPOS — Functional Specification

Last updated: 2025-08-25

1. Overview
AnnaPOS is a point-of-sale style web application to simplify handling of in-store orders. It supports authenticated access, product catalog browsing with filtering, order creation and completion, and a developer utility to import demo data from FakeStore API.

2. User Roles
- Cashier/Staff (authenticated user)
  - Logs in with email/password.
  - Browses products and categories.
  - Searches and filters products.
  - Adds items to a cart and places orders for customers.
  - Marks orders as completed.
  - Optionally deletes orders.
  - Triggers one-click demo data synchronization from FakeStore (for demo/dev setups).

3. Main User Flows
3.1 Authentication
- User opens the app. The frontend checks session via GET /api/auth/cookie (httpOnly cookie-based session).
- If not authenticated, the user logs in via POST /api/auth/login with email/password.
- On success, the backend sets a httpOnly cookie token and returns user + token (also used by SPA state).
- Logout (POST /api/auth/logout) clears the cookie and resets SPA state.

3.2 Catalog Browsing
- Categories list is fetched via GET /api/categories (supports q= filter).
- Products list is fetched via GET /api/products with optional filters:
  - q: text search
  - categoryId: numeric category filter
  - limit, offset: pagination
- Products show: image, title, category, price, rating info (if available from data source).

3.3 Cart and Orders
- From Products page, the user adds products (with default quantity 1 per click) to an in-memory cart.
- Creating an order sends POST /api/orders with items array: [{ productId, quantity }].
- Orders management:
  - List: GET /api/orders?limit&offset&status
  - Detail: GET /api/orders/:id
  - Complete: PATCH /api/orders/:id/complete
  - Delete: DELETE /api/orders/:id
- Order statuses: PENDING, COMPLETED, CANCELLED (by code definition). UI commonly moves PENDING -> COMPLETED.

3.4 Demo Data Synchronization
- A button "Sync FakeStore" triggers POST /api/sync/fakestore.
- The backend fetches categories and products from fakestoreapi.com and upserts them into the local database.

4. Error Handling and Feedback
- API errors are returned as JSON { message } where applicable; the frontend surfaces messages near forms or as alerts.
- Protected endpoints require a valid JWT in an httpOnly cookie; otherwise, 401/403 is expected.

5. Non-Goals / Out of Scope (current iteration)
- Payments processing and receipts printing.
- Inventory management (stock levels) beyond catalog listing.
- Multi-store support or advanced roles/permissions.
- Customer accounts and loyalty programs.

6. Assumptions
- Single-tenant deployment for a small store.
- Authentication via a pre-seeded admin account (from migrations) for demo/testing.

7. Acceptance Scenarios (happy paths)
- A user can log in with the provided demo credentials and subsequently call protected endpoints successfully.
- Products page loads categories and products, allows search/filter, and paginates results.
- User can create an order with at least one item and then mark it as completed.
- Sync FakeStore populates categories and products and shows a success message.

8. Accessibility & UX Notes
- Simple form controls and clear feedback messages.
- Pagination controls include page and per-page selectors.

9. Security
- JWT is stored in an httpOnly cookie with SameSite=strict; secure flag in prod.
- All business endpoints (except login) are protected by token authentication.
