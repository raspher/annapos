# AnnaPOS
Rozwiązanie mające na celu ułatwienie obsługi zamówień w sklepie stacjonarnym

## Stack
- Frontend: React + Vite + Tailwindcss
- Backend: Express

## Uruchamianie

Projekt ma 2 tryby:
- `yarn dev` - uruchamia frontend i backend w trybie debug
- - debugowanie frontendu domyślnie na porcie `5173`
- - debugowanie backendu domyślnie na porcie `9229`
- `yarn prod` - buduje frontend i uruchamia backend
- - Frontend jest budowany i optymalizowany do katalogu `src/frontend/dist`
- - Backend hostuje statyczny frontend pod głównym adresem `example.com`, a API pod `example.com/api/`

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