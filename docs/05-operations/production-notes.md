# Wichtige TODOs für Produktion

Dieses Dokument enthält wichtige Punkte, die vor einem produktiven Einsatz der Anwendung angepasst oder ergänzt werden müssen.

Die aktuelle Implementierung ist für **lokale Entwicklung und Prototyping** ausgelegt.

---

# 1. SECRET_KEY ersetzen

Datei:

backend/.env

Der `SECRET_KEY` wird im Backend verwendet, um **JWT-Tokens kryptographisch zu signieren**.

Das bedeutet:

- Der Server erstellt ein Token mit einer digitalen Signatur
- Diese Signatur stellt sicher, dass das Token **nicht manipuliert wurde**

Wenn jemand den Secret Key kennt, könnte er selbst gültige Tokens erzeugen.

Der aktuelle Key ist nur für Entwicklung geeignet.

Für Produktion muss:

- ein **langer**
- **zufällig generierter**
- **sicherer Schlüssel**

verwendet werden.

Der Key darf **nicht im Repository gespeichert werden**.

Empfohlen:

- Environment Variables
- Secret Management Systeme (z. B. Docker Secrets, Cloud Secrets)

---

# 2. CSRF-Schutz implementieren

Da der Access Token aktuell in einem **Cookie** gespeichert wird, müssen zustandsverändernde Requests gegen **CSRF-Angriffe** geschützt werden.

CSRF bedeutet:

Ein Angreifer bringt den Browser eines eingeloggten Nutzers dazu, eine Anfrage an die Anwendung zu senden.

Da Cookies automatisch mitgesendet werden, könnte ein Angreifer so Aktionen im Namen des Nutzers ausführen.

Beispiele:

- Event erstellen
- Event beitreten
- Profil ändern

Mögliche Strategien:

- CSRF Token
- Double Submit Cookie Pattern
- zusätzlicher Custom Header (z. B. `X-CSRF-Token`)
- Kombination mit `SameSite` Cookie Strategie

Dieser Punkt ist für Produktionssicherheit **sehr wichtig**.

---

# 3. secure=True für Cookies

Aktuell wird das Cookie in der lokalen Entwicklung mit:

secure=False

gesetzt.

In Produktion muss dies geändert werden zu:

secure=True

Dadurch wird sichergestellt, dass Cookies **nur über HTTPS übertragen werden**.

Das verhindert, dass Tokens über unverschlüsselte Verbindungen abgefangen werden.

---

# 4. HTTPS erzwingen

Die Anwendung muss in Produktion ausschließlich über **HTTPS** erreichbar sein.

HTTPS sorgt dafür, dass:

- Login-Daten verschlüsselt übertragen werden
- Tokens nicht im Klartext übertragen werden
- Cookies nicht abgefangen werden können

Ohne HTTPS wäre der gesamte Authentifizierungsprozess unsicher.

---

# 5. SQLite durch PostgreSQL ersetzen

Aktuell wird SQLite verwendet:

backend/app.db

SQLite ist eine **Dateibasierte Datenbank**, die für Entwicklung gut geeignet ist.

Für Produktion sollte eine **Server-Datenbank** verwendet werden.

Empfohlen:

PostgreSQL

Vorteile:

- bessere Performance
- gleichzeitige Nutzerzugriffe
- stabileres Datenbankmanagement
- bessere Backup-Strategien

Dabei müssen angepasst werden:

- `DATABASE_URL`
- Datenbanktreiber
- Deployment-Konfiguration

---

# 6. CORS-Konfiguration einschränken

CORS steuert, **welche Domains Requests an das Backend senden dürfen**.

In Entwicklung ist CORS oft sehr offen konfiguriert.

In Produktion dürfen nur die echten Frontend-Domains erlaubt werden.

Beispiel:

https://app.domain.com

Damit wird verhindert, dass fremde Webseiten direkt Requests an die API senden können.

---

# 7. Cookie-Konfiguration prüfen

Folgende Cookie-Parameter sollten für Produktion überprüft werden:

- `secure=True`
- `httponly=True`
- `samesite` Strategie (`lax`, `strict`, oder `none`)

Diese Parameter steuern:

- ob JavaScript Zugriff auf Cookies hat
- ob Cookies nur über HTTPS gesendet werden
- wann Cookies bei Cross-Site Requests mitgesendet werden

---

# 8. Token-Lebensdauer prüfen

Der Access Token besitzt aktuell eine feste Laufzeit.

Diese bestimmt, wie lange ein Nutzer eingeloggt bleibt.

Später sollte geprüft werden:

- ob die Laufzeit sinnvoll ist
- ob zusätzlich **Refresh Tokens** eingeführt werden sollen
- ob eine automatische Token-Erneuerung sinnvoll ist

---

# 9. Rate Limiting für Auth-Endpunkte

Um Missbrauch zu verhindern, sollten folgende Endpunkte begrenzt werden:

/auth/login
/auth/register

Ziel:

- Schutz vor Brute-Force-Angriffen
- Schutz vor automatisierten Registrierungen
- Schutz vor API-Missbrauch

Beispiel:

Ein Nutzer darf nur eine bestimmte Anzahl Login-Versuche pro Minute durchführen.

---

# 10. Logging erweitern

Für Produktion sollte Logging ergänzt werden für:

- erfolgreiche Logins
- fehlgeschlagene Logins
- Token-Fehler
- wichtige API-Aktionen

Wichtig:

- keine Passwörter loggen
- keine vollständigen Tokens loggen

Logging hilft dabei:

- Sicherheitsprobleme zu erkennen
- Fehler zu analysieren
- Systemverhalten zu überwachen

---

# 11. Debug-Modus deaktivieren

In Produktion muss gelten:

DEBUG=false

Debug-Ausgaben enthalten oft:

- interne Fehlerdetails
- Stacktraces
- Systeminformationen

Diese Informationen sollten **nicht öffentlich sichtbar sein**.

---

# 12. Environment-Konfiguration trennen

Unterschiedliche Konfigurationen sollten existieren für:

- local
- development
- staging
- production

Insbesondere für:

- Secret Keys
- Datenbank
- CORS
- Cookies
- Logging

Das verhindert, dass Entwicklungswerte versehentlich in Produktion verwendet werden.

---

# Zusammenfassung

Vor Produktionsbetrieb müssen insbesondere folgende Punkte umgesetzt werden:

- sicherer `SECRET_KEY`
- CSRF-Schutz
- HTTPS + `secure=True`
- PostgreSQL statt SQLite
- eingeschränkte CORS-Regeln
- Rate Limiting für Auth-Endpunkte
- Debug-Modus deaktivieren
- saubere Environment-Konfiguration

Diese Liste dient als **Erinnerung für sicherheitsrelevante und infrastrukturelle Anpassungen**, die für einen stabilen und sicheren Produktionsbetrieb notwendig sind.
