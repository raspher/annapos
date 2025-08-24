# AnnaPOS
Rozwiązanie mające na celu ułatwienie obsługi zamówień w sklepie stacjonarnym

## Stack
- Frontend: React + Vite + Tailwindcss
- Backend: Express

## Uruchamianie
- `docker-compose --profile dev --env-file .\.env.dev up --build`
- `docker-compose --profile prod --env-file .\.env.prod up --build`

`--build` jest wymagane gdy zmieniamy/aktualizujemy zależności

Projekt ma 2 profile:

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

### Deploy
**TODO**

zalecany `docker-compose`

## Architektura

- Vertical slice - zwiększa czytelność i stabilność kodu