# Admin-Berechtigung im Backend

Dieses Dokument beschreibt die Einführung einer Admin-Berechtigung im Backend.

Damit wurde das bisherige Berechtigungssystem erweitert: Nicht mehr nur der Ersteller eines Events darf es bearbeiten oder löschen, sondern zusätzlich auch Nutzer mit Admin-Rechten.

---

# 1. Ziel

Ziel war es, ein einfaches Rollenmodell einzuführen, damit bestimmte Nutzer erweiterte Rechte erhalten.

Konkret sollte ein Admin:

- jedes Event bearbeiten dürfen
- jedes Event löschen dürfen

Normale Nutzer sollen weiterhin nur ihre eigenen Events verwalten können.

---

# 2. Grundidee

Die Lösung basiert auf einem zusätzlichen Boolean-Feld im User-Modell:

- `is_admin`

Dadurch kann das Backend klar unterscheiden zwischen:

- normalen Nutzern
- Administratoren

---

# 3. Erweiterung des User-Modells

Datei:

backend/app/models/user.py

## Neues Feld

Dem User-Modell wurde hinzugefügt:

- `is_admin`

Eigenschaften:

- Boolean
- Standardwert: `False`
- Pflichtfeld (`nullable=False`)

## Zweck

Dieses Feld steuert, ob ein Nutzer administrative Rechte besitzt.

---

# 4. Erweiterung der User-Schemas

Datei:

backend/app/schemas/user.py

## Änderung in UserRead

Das Feld

- `is_admin`

wird jetzt in API-Responses zurückgegeben.

Dadurch kann das Frontend erkennen, ob der eingeloggte Nutzer Admin ist.

## Wichtige Entscheidung

Im Registrierungsschema `UserCreate` wurde `is_admin` bewusst **nicht** aufgenommen.

### Grund

Normale Nutzer dürfen sich nicht selbst Admin-Rechte geben.

Admin-Rechte werden nur serverseitig gesetzt.

---

# 5. Änderung der Berechtigungslogik bei Events

Datei:

backend/app/api/events.py

Vor der Änderung galt:

- nur der Creator eines Events durfte es bearbeiten oder löschen

Die frühere Logik war sinngemäß:

- wenn `event.creator_id != current_user.id` → Zugriff verweigern

---

## Neue Logik

Jetzt gilt:

Ein Event darf bearbeitet oder gelöscht werden, wenn:

- der aktuelle Nutzer der Creator ist
- oder der aktuelle Nutzer `is_admin == True` hat

---

## Betroffene Endpunkte

### PATCH /events/{event_id}

Admins dürfen jetzt jedes Event bearbeiten.

### DELETE /events/{event_id}

Admins dürfen jetzt jedes Event löschen.

---

# 6. Vorteil dieser Lösung

Die Berechtigungslogik bleibt einfach und nachvollziehbar.

Statt harter Sonderfälle wie:

- bestimmter Username
- bestimmte E-Mail-Adresse

gibt es jetzt ein klares Rollenfeld im Datenmodell.

Vorteile:

- sauber erweiterbar
- mehrere Admins möglich
- keine Hardcodierung von Identitäten
- gut dokumentierbar

---

# 7. Admin-User setzen

Da normale Registrierung keine Admin-Rechte vergibt, wurde zusätzlich ein Verwaltungs-Script eingeführt.

Datei:

backend/scripts/manage_admin.py

---

## Unterstützte Aktionen

Das Script unterstützt aktuell:

- `make`
- `remove`
- `list`

---

## Verwendung

### Admin setzen

python -m scripts.manage_admin make email@example.com

### Admin entfernen

python -m scripts.manage_admin remove email@example.com

### Admins auflisten

python -m scripts.manage_admin list

---

## Zweck des Scripts

Das Script ermöglicht eine einfache Benutzerverwaltung in der Entwicklungsphase, ohne dass dafür bereits ein Admin-Panel oder ein eigenes Management-Interface gebaut werden muss.

---

# 8. Warum ein Script statt Frontend-Lösung?

Zum aktuellen Zeitpunkt ist das Script die pragmatischste Lösung.

Vorteile:

- schnell einsetzbar
- sicherer als Admin-Rechte über Register oder API freizugeben
- sauber versionierbar im Projekt

Später kann daraus ein Admin-Panel entstehen.

---

# 9. Sicherheitsaspekte

Die aktuelle Lösung ist für MVP und Entwicklung gut geeignet.

Wichtig ist:

- `is_admin` darf nicht vom Frontend frei gesetzt werden
- Admin-Rechte dürfen nur serverseitig oder über kontrollierte Tools geändert werden

---

# 10. Aktueller Stand

Das Backend unterstützt jetzt:

- Admin-Markierung über `is_admin`
- Admin-Erkennung in `UserRead`
- Event-Bearbeitung durch Creator oder Admin
- Event-Löschung durch Creator oder Admin
- Admin-Verwaltung über CLI-Script

---

# 11. Nächste mögliche Schritte

Spätere sinnvolle Erweiterungen:

- Rollenmodell mit mehreren Rollen
- Admin-Panel im Frontend
- Audit-Log für Admin-Aktionen
- feinere Rechtevergabe
- Schutz bestimmter Admin-Funktionen über eigene Dependencies

---

# Zusammenfassung

Mit der Einführung von `is_admin` wurde das Berechtigungssystem des Backends erweitert.

Admins können nun:

- fremde Events bearbeiten
- fremde Events löschen

Die Lösung ist schlank, nachvollziehbar und gut erweiterbar.
