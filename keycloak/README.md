# Realm Keycloak per Stillum

Il file `stillum-realm.json` viene importato automaticamente all’avvio di Keycloak (Docker Compose con `--import-realm`). Alla prima partenza, o dopo aver ricreato i container, il realm **stillum** e il client **portal-ui** sono subito disponibili.

## Contenuto

- **Realm:** `stillum`
- **Client OIDC:** `portal-ui` (public, Authorization Code)
  - Redirect URI: `http://localhost:5173/oidc/callback` (e varianti 3000, 127.0.0.1)
- **Utente di test:** `developer` / `developer` (email: developer@stillum.local)

## Portal UI

Imposta in `.env` (o variabili d’ambiente) per il login OIDC:

- `VITE_OIDC_AUTHORITY=http://localhost:8080/realms/stillum`
- `VITE_OIDC_CLIENT_ID=portal-ui`

## Modifiche al realm

Dopo aver modificato `stillum-realm.json`, per riapplicare l’import ricrea i container Keycloak (senza volume dati Keycloak l’import viene rieseguito a ogni avvio):

```bash
docker compose down keycloak && docker compose up -d keycloak
```

Se Keycloak usa un volume dati persistente, il realm esistente **non** viene sovrascritto (l’import viene saltato). In quel caso rimuovi prima il realm dalla console admin o elimina il volume.

## Errori in console del browser

Messaggi come **"Attempting to use a disconnected port object"**, **"Error: Cancelled"**, **"SecretSession.encrypt"**, **"FrameDoesNotExistError"**, **"extensionState.js"** e simili provengono da **estensioni del browser** (React DevTools, password manager, ad blocker, ecc.), non dall’app. Per una console pulita: apri il portale in una **finestra in incognito** o disattiva le estensioni.

Se vedi **400 sul token OIDC**: dopo il login, la pagina di callback mostrerà l’eventuale messaggio di errore restituito da Keycloak. Puoi anche controllare **Keycloak > Realm stillum > Events** oppure `docker logs stillum-keycloak` per i dettagli.
