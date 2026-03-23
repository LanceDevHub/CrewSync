# Master-Passwort / Site Access (Frontend + Backend)

Dieses Dokument beschreibt die Implementierung des Master-Passworts (Site Access), welches den Zugriff auf die Anwendung einschränkt.

Das Feature dient als einfache Zugangskontrolle für das MVP.

---

# 1. Ziel

Ziel ist es, den Zugriff auf die Anwendung zu beschränken:

- Nutzer müssen ein Master-Passwort eingeben
- erst danach ist Zugriff auf Login / Register / App möglich
- Schutz vor ungewolltem Zugriff während Entwicklung / Testing

---

# 2. Grundidee

Zusätzlich zur normalen Benutzer-Authentifizierung gibt es eine vorgelagerte Prüfung:

User öffnet App  
↓  
Site Access prüfen  
↓  
falls nicht vorhanden → AccessGatePage anzeigen  
↓  
Passwort eingeben  
↓  
Access erlauben  
↓  
App nutzbar

---

# 3. Backend-Implementierung

## Neue Dependency

Datei:

backend/app/api/deps/site_access.py

### Funktion

require_site_access

Diese Funktion:

- liest Cookie `site_access`
- prüft Wert gegen Master-Passwort aus `.env`
- erlaubt oder blockiert Request

---

## Konfiguration

.env

SITE_ACCESS_PASSWORD=mein-passwort

---

## Anwendung der Dependency

Wird global oder pro Route verwendet:

Depends(require_site_access)

---

## Verhalten

- korrektes Passwort → Cookie wird gesetzt
- falsches Passwort → 403 Forbidden

---

# 4. Frontend-Implementierung

## Neue Seite

Datei:

src/pages/AccessGatePage.tsx

---

## Funktionen

- Eingabefeld für Passwort
- Button zum Bestätigen
- Fehleranzeige
- Loading-State

---

## Ablauf

User gibt Passwort ein  
↓  
POST /site-access  
↓  
Backend setzt Cookie  
↓  
Frontend reload / redirect  
↓  
App wird sichtbar

---

# 5. Integration in App.tsx

## Neuer State

const [siteAccessGranted, setSiteAccessGranted] = useState(false);  
const [siteAccessChecked, setSiteAccessChecked] = useState(false);

---

## Check beim Start

checkSiteAccess();

→ prüft, ob Cookie vorhanden ist

---

## Routing-Logik

if (!siteAccessChecked) return <Loading />;

if (!siteAccessGranted) {
return <AccessGatePage onSuccess={...} />;
}

---

## Ergebnis

- App ist komplett gesperrt ohne Master-Passwort
- Login/Register sind nicht erreichbar ohne Zugang

---

# 6. Cookie-Verhalten

Backend setzt Cookie:

site_access

Eigenschaften:

- HttpOnly
- automatisch bei Requests enthalten
- wird nicht im Frontend gespeichert

---

# 7. Wichtige Erkenntnisse

## 7.1 Cookie-basierte Zugangskontrolle

Frontend speichert nichts selbst → Browser übernimmt alles

---

## 7.2 Reihenfolge der Checks

1. Site Access
2. Auth (Login)

→ getrennte Systeme

---

## 7.3 Reload-Problematik

Problem:

- nach Reload war Zugriff weg

Lösung:

- /site-access/check Endpoint
- Frontend prüft beim Start

---

# 8. Sicherheitsbewertung

## Aktueller Zweck

- Schutz für MVP / Entwicklung
- kein vollwertiges Security-System

---

## Einschränkungen

- Passwort ist global
- kein User-spezifischer Zugriff
- kein Rate Limiting

---

## Verbesserungen (optional)

- Rate Limiting
- IP-basierte Einschränkungen
- Admin-Panel statt Passwort

---

# 9. Zusammenspiel mit Auth

| Feature     | Zweck          |
| ----------- | -------------- |
| Site Access | Zugang zur App |
| Auth        | Benutzer-Login |

---

## Reihenfolge

1. Site Access
2. Login
3. Nutzung der App

---

# 10. Was jetzt funktioniert

✔ App ist durch Master-Passwort geschützt  
✔ Zugriff nur nach Eingabe möglich  
✔ Zustand bleibt nach Reload erhalten  
✔ Integration in Routing funktioniert  
✔ Trennung von Auth und Access sauber umgesetzt

---

# 11. Nächste mögliche Schritte

- UI verbessern (z. B. schöner Gate Screen)
- Passwort-Reset Mechanismus
- Admin-Steuerung
- Feature optional deaktivierbar machen

---

# Zusammenfassung

Das Master-Passwort ergänzt die Anwendung um eine einfache Zugriffskontrolle vor der eigentlichen Authentifizierung.

Damit ist die Anwendung:

- kontrollierbar zugänglich
- sicherer während Entwicklung
- strukturell sauber erweitert
