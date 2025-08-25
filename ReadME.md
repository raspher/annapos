# AnnaPOS
Rozwiązanie mające na celu ułatwienie obsługi zamówień w sklepie stacjonarnym

## Stack
- Frontend: React + Vite + Tailwindcss
- Backend: Express

## Uruchamianie
- `docker-compose --profile dev --env-file .\.env.dev up --build`
- `docker-compose --profile prod --env-file .\.env.prod up --build`

`--build` jest wymagane gdy zmieniamy/aktualizujemy zależności

- **jak wgrać migracje** - [How to](backend/docs/database.md)
(pomijam .env w repo, zamieszczone celowo jako przykład)
- **wdrożenie**: docker-compose na VPS, nie korzystałem nigdy z *Vercel / Netlify / Render / Railway*
- **dane logowania** (dodane w migracji): 
  - login: `admin@admin.pl` 
  - hasło:`changeme`

### Profile

dev:
- debugowanie backendu domyślnie na porcie `9229`
- debugowanie frontendu na porcie `${FRONTEND_PORT}`

prod:
- Frontend jest budowany i optymalizowany
- Backend hostuje statyczny frontend pod głównym adresem `example.com`, a API pod `example.com/api/`

### Zmienne środowiskowe
- `VITE_API_BASE_URL` - URL do backendu (`https://example.com:12345/api` | `/api` dla prod)
- `JWT_SECRET` - klucz szyfrujący token
- `API_PORT` - port na którym ma nasłuchiwać API (`8080`)
- `PROFILE` - na podtrzeby CORS (`DEV` / `PROD`)

## Architektura

- Vertical slice - zwiększa czytelność i stabilność kodu

### todo
- ARCHITEKTURA PROJEKTU
- aktualne stany magazynowe? stany się nie zmieniają...
- wszystko zabezpieczone tokenem?
- zamówienie - klient?
- klienci przy dodawaniu zamówienia?
- DOKUMENTACJA:
  - Specyfikacja funkcjonalna (co robi aplikacja),
  - Specyfikacja techniczna (stack, struktura, diagramy – opcjonalnie),
  - Plik `README.md` (z instrukcją uruchomienia i danymi logowania),
  - PRD (Product Requirements Document),
  - Changelog (jeśli występuje rozwój iteracyjny).
- TESTY

opcjonalnie:
- udawany guzik "paragon" i "faktura" w liście zamówień?