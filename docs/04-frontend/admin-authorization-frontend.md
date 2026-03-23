# Admin-Berechtigung im Frontend

Dieses Dokument beschreibt die Integration der Admin-Berechtigung im Frontend.

Nachdem das Backend um das Feld `is_admin` erweitert wurde, musste das Frontend angepasst werden, damit Administratoren auch in der Benutzeroberfläche korrekt erkannt und dargestellt werden.

---

# 1. Ziel

Ziel war es, die neuen Admin-Rechte auch im Frontend sichtbar und nutzbar zu machen.

Ein Admin soll:

- im Frontend als Admin erkennbar sein
- Events bearbeiten dürfen, auch wenn er nicht der Ersteller ist
- Events löschen dürfen, auch wenn er nicht der Ersteller ist

---

# 2. Erweiterung des User-Typs

Datei:

src/types/user.ts

Der User-Typ wurde erweitert um:

- `is_admin`

Dadurch kann das Frontend an allen Stellen unterscheiden, ob ein Nutzer Admin ist.

---

# 3. Admin-Erkennung nach Login

Da `/auth/me` und Login-Responses nun auch `is_admin` enthalten, steht diese Information nach Login und beim erneuten Laden der App automatisch zur Verfügung.

Das bedeutet:

- kein zusätzlicher Request notwendig
- keine separate Rollenlogik im Frontend nötig

---

# 4. Anpassung der Event-Berechtigung im Frontend

Datei:

src/pages/EventDetailPage.tsx

Vor der Änderung wurde geprüft:

- ist der aktuelle Nutzer Creator?

Nur dann wurden Buttons für Bearbeiten und Löschen angezeigt.

---

## Neue Logik

Jetzt wird unterschieden zwischen:

- `isCreator`
- `isAdmin`

Zusätzlich wurde ein kombinierter Zustand verwendet:

- `canManageEvent = isCreator || isAdmin`

Damit erscheinen Bearbeiten- und Löschen-Buttons jetzt auch für Administratoren.

---

# 5. Anzeige auf der Event-Detailseite

Die UI wurde so erweitert, dass Admins auch bei fremden Events Management-Aktionen sehen.

Zusätzlich kann angezeigt werden:

- Creator-Hinweis, wenn der Nutzer Ersteller ist
- Admin-Hinweis, wenn der Nutzer als Admin agiert

Dadurch bleibt transparent, warum bestimmte Aktionen verfügbar sind.

---

# 6. Admin-Badge in der Navigation

Datei:

src/components/layout/Navbar.tsx

In der Navigation wird jetzt bei eingeloggten Admins ein Badge angezeigt:

- `Admin`

Dadurch ist die Rolle direkt im globalen UI sichtbar.

Vorteile:

- sofort erkennbar
- nützliche visuelle Rückmeldung
- besseres Rollenverständnis

---

# 7. Admin-Badge auf der Profilseite

Datei:

src/pages/ProfilePage.tsx

Auch im Profilbereich wird die Rolle über ein Badge sichtbar gemacht.

Das ergänzt die persönlichen Nutzerdaten sinnvoll und macht Admin-Rechte dauerhaft nachvollziehbar.

---

# 8. UX-Entscheidung

Die Admin-Rolle wurde bewusst dezent, aber klar sichtbar gemacht.

Gewählt wurde:

- Badge statt auffälliger Sonderseite
- Integration in bestehende UI
- keine Überladung des Interfaces

Damit bleibt die Oberfläche übersichtlich, auch für normale Nutzer.

---

# 9. Vorteil dieser Frontend-Lösung

Die Frontend-Integration ist bewusst leichtgewichtig.

Vorteile:

- keine komplizierte Rollenverwaltung im Client
- Rollenstatus kommt direkt aus dem Backend
- Buttons und Badges können einfach bedingt gerendert werden
- klare Trennung zwischen Rechteprüfung im Backend und Darstellung im Frontend

Wichtig:

Das Frontend zeigt nur an, was erlaubt ist.  
Die eigentliche Sicherheit bleibt im Backend.

---

# 10. Aktueller Stand

Das Frontend unterstützt jetzt:

- Erkennung von `is_admin`
- Admin-Badge in Navbar
- Admin-Badge im Profil
- Bearbeiten/Löschen von Events auch für Admins
- klare Trennung zwischen Creator und Admin

---

# 11. Nächste mögliche Schritte

Sinnvolle spätere Erweiterungen:

- eigenes Admin-Panel
- Nutzerliste im Frontend
- Admin-Rechte per UI setzen/entfernen
- Filter für Admin-Aktionen
- Rollenanzeige an weiteren Stellen

---

# Zusammenfassung

Mit der Erweiterung um `is_admin` wurde das Frontend an das neue Rollenmodell des Backends angepasst.

Administratoren sind jetzt:

- sichtbar gekennzeichnet
- funktional im UI berücksichtigt
- in Event-Management-Ansichten korrekt unterstützt

Dadurch ist das Rollenmodell nicht nur technisch vorhanden, sondern auch in der Oberfläche nachvollziehbar und nutzbar.
