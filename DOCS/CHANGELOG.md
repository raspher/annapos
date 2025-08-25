# Changelog — AnnaPOS

All notable changes to this project will be documented in this file.

The format is inspired by Keep a Changelog, and the project adheres to Semantic Versioning where applicable.

## [0.1.0] - 2025-08-25
### Added
- Initial MVP features:
  - Auth endpoints: /api/auth/login, /api/auth/logout, /api/auth/cookie
  - Catalog endpoints: /api/categories, /api/products (filters & pagination)
  - Orders endpoints: create, list, get, complete, delete
  - Sync endpoint: /api/sync/fakestore
- Frontend React app with Products and Login pages, Auth context, and API services.
- Docker-based dev/prod setup.
- Documentation set under DOCS/: Functional_Spec.md, Technical_Spec.md, PRD.md, CHANGELOG.md.
- Detailed Technical Specification covering stack, architecture, endpoints, and diagrams (textual).
- PRD with goals, user stories, acceptance criteria, and KPIs.