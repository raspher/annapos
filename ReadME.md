# AnnaPOS
Rozwiązanie mające na celu ułatwienie obsługi zamówień w sklepie stacjonarnym

## Stack
- Frontend: React + Vite + Tailwindcss
- Backend: Express

## Uruchamianie

Projekt ma 2 tryby:
- `yarn dev` - uruchamia frontend i backend w trybie debug 
- `yarn prod` - buduje frontend i uruchamia backend

### Dev
- Frontend jest możliwy do debugowania na porcie `5173`
- Backend operuje na porcie `8080`, a debugger można podłączyć na porcie `9229`

### Prod
- Frontend jest budowany i optymalizowany do katalogu `frontend/dist`
- Backend hostuje statyczny frontend pod głównym adresem `example.com`, a API pod `example.com/api/`

### Deploy
**TODO**

zalecany `docker-compose`