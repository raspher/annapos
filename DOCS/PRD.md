# Product Requirements Document (PRD) — AnnaPOS

Last updated: 2025-08-25

1. Product Overview
AnnaPOS is a lightweight Point-of-Sale style web application for small brick-and-mortar shops. It enables staff to authenticate, browse a product catalog with filters, create and manage customer orders, and populate demo data via FakeStore API for quick setup and demos.

2. Goals & Non-Goals 
   1. Goals
      - Provide a simple, secure login for staff users.
      - Offer fast product browsing with search, category filtering, and pagination.
      - Allow staff to create orders from a cart-like flow, mark orders complete, and delete when needed.
      - Provide a one-click demo data sync to bootstrap categories and products.

   2. Non-Goals (for current iteration)
      - Payment processing (no card readers/invoices/receipts).
      - Inventory stock tracking or adjustments.
      - Multi-store management and advanced RBAC.
      - Customer profiles, loyalty, or CRM features.

3. Target Users
- Store staff/cashiers in small shops who need minimal friction to serve customers.
- Demo evaluators (developers, stakeholders) who need sample data quickly.

4. User Stories
- As a staff member, I can log in with my credentials so that I can access the system securely.
- As a staff member, I can search and filter products by name and category so that I can quickly find items.
- As a staff member, I can set a page size and navigate pages so that I can handle large catalogs efficiently.
- As a staff member, I can add products to a cart and submit an order so that I can record a customer’s purchase.
- As a staff member, I can mark an order as completed so that I can finalize the transaction in the system.
- As a staff member, I can delete an order when necessary so that I can correct mistakes.
- As a demo user, I can trigger a FakeStore sync so that I have a populated catalog for testing.

5. Functional Requirements
- Authentication
  - FR1: Login via email/password; on success, set httpOnly cookie token and return user+token in JSON.
  - FR2: Logout clears the cookie.
  - FR3: Session check via GET /api/auth/cookie returns user/token if valid.

- Catalog
  - FR4: List categories with optional text filter.
  - FR5: List products with optional text filter, categoryId filter, and pagination via limit/offset.
  - FR6: Product data includes image, title, category, price, and optional ratings.

- Orders
  - FR7: Create an order from items [{ productId, quantity }].
  - FR8: List orders with limit/offset and optional status filter.
  - FR9: Get order details by ID.
  - FR10: Mark order as COMPLETE.
  - FR11: Delete order by ID.

- Demo Data
  - FR12: Trigger FakeStore sync to import/update categories and products.

6. Non-Functional Requirements
- NFR1: Security — JWT in httpOnly cookie; protect business endpoints with auth.
- NFR2: Performance — Catalog and orders list endpoints must respond within 500ms (p50) on typical datasets (<10k products) on modest hardware.
- NFR3: Reliability — API returns consistent JSON shapes; errors include a message field where applicable.
- NFR4: Usability — Clear UI affordances; visible loading states and errors.
- NFR5: Deployability — Docker-based dev and prod profiles.

7. Acceptance Criteria
- AC1: With demo credentials (admin@admin.pl / changeme), user can log in and subsequently access protected endpoints.
- AC2: Products page shows categories, supports searching and filtering, and paginates correctly.
- AC3: Creating an order with at least one item returns 201 and the created order object.
- AC4: Marking an order complete changes its status and returns the updated order.
- AC5: Deleting an order returns 200 with a confirmation message.
- AC6: FakeStore sync completes without error and subsequent product/category lists reflect imported data.

8. Release Scope (MVP)
- Auth, catalog listing, orders create/complete/delete, FakeStore sync, basic UI for products and login.

9. Risks & Mitigations
- R1: External FakeStore dependency downtime — Mitigation: graceful error handling; retry policy can be added later.
- R2: Cookie security in non-HTTPS environments — Mitigation: secure flag enabled only in prod; document requirements.
- R3: Dataset growth impacting performance — Mitigation: pagination; indexing strategy documented in DB layer (future).

10. Metrics / KPIs
- Login success rate and error rate.
- Median response time for /products and /orders endpoints.
- Number of orders created per session (basic engagement).
- Sync duration and failure rate.

11. Open Questions
- Do we need guest mode (no auth) for kiosk demos? Currently out of scope.
- Should we support discounts/taxes per item? Currently out of scope.
