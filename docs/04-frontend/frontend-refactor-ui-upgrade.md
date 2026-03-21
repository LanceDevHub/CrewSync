# Frontend Refactor & UI Upgrade

Dieses Dokument beschreibt die Weiterentwicklung des Frontends nach der initialen Implementierung der Event-Funktionalität.

Der Fokus lag auf:

- Verbesserung der UI durch Chakra UI
- saubere Komponentenstruktur
- bessere Wiederverwendbarkeit
- konsistente User Experience
- bessere Navigation
- klarere Profilseite

---

# 1. Ziel dieses Abschnitts

Ziel war es, das Frontend von einer funktionalen Version zu einer strukturierten, skalierbaren UI weiterzuentwickeln.

Schwerpunkte:

- Reduktion von Code-Duplikaten
- Einführung wiederverwendbarer Komponenten
- Vereinheitlichung der Seitenstruktur
- Verbesserung der Navigation
- bessere UX für Event-Listen und Profilseite

---

# 2. Einführung von Chakra UI

Das Frontend wurde auf Chakra UI umgestellt.

## Vorteile

- konsistentes Design
- weniger eigenes CSS
- schnellere UI-Entwicklung
- bessere Lesbarkeit des Codes
- klarere Struktur der Komponenten

## Wichtige Erkenntnis

Für Navigation mit React Router muss bei Chakra `asChild` verwendet werden.

---

# 3. Neue Komponentenstruktur

Es wurden mehrere wiederverwendbare Komponenten eingeführt.

## 3.1 EventCard

Zentrale Darstellung eines Events.

Die EventCard enthält:

- Titel
- Beschreibung (gekürzt)
- Metadaten
- Teilnehmer-Vorschau
- Link zur Detailseite

Vorteil:

- gleiche Darstellung in mehreren Listen
- weniger doppelter Code

---

## 3.2 ParticipantsPreview

Diese Komponente zeigt Teilnehmer eines Events an.

Verhalten:

- maximal 3 Usernamen werden dargestellt
- bei mehr Teilnehmern wird zusätzlich „...“ angezeigt
- bei keinen Teilnehmern wird ein leerer Zustand angezeigt

---

## 3.3 EventMeta

Diese Komponente kapselt zentrale Event-Metadaten:

- Ersteller
- Ort
- Genre
- Beginn
- Ende

Verwendung:

- EventCard
- EventDetailPage

---

## 3.4 Common Components

### LoadingState

- zeigt Spinner + Nachricht
- ersetzt mehrfachen Lade-Code

### EmptyState

- zeigt leere Zustände
- ersetzt wiederholte UI-Blöcke

### PageContainer

- einheitliches Seitenlayout
- optional Titel + Beschreibung
- strukturiert alle Seiten konsistent

---

# 4. Navbar Verbesserung

Die Navigation wurde deutlich verbessert.

## Neue Features

- klickbarer App-Name
- Anzeige des eingeloggten Users
- aktive Route wird hervorgehoben
- Logout Button integriert
- Zurück-Button über Browser-History

## Verhalten

Nicht eingeloggt:

- Login
- Register

Eingeloggt:

- Events
- Create Event
- Profile
- Logout

---

# 5. Refactor der EventsPage

Die EventsPage wurde vollständig überarbeitet.

## Änderungen

- Nutzung von Chakra UI
- Filterformular integriert
- EventCard für Darstellung
- Teilnehmer-Vorschau direkt sichtbar
- LoadingState und EmptyState integriert
- PageContainer für Layout

## Teilnehmer-Vorschau

- zeigt die ersten 3 Teilnehmer
- bei mehr Teilnehmern wird „...“ angezeigt

---

# 6. Refactor der CreateEventPage

## Änderungen

- Formular mit Chakra UI Komponenten
- konsistentes Layout
- Fehleranzeige im UI
- neue Felder integriert:
  - start_datetime
  - end_datetime

Entfernt:

- max_participants

---

# 7. Refactor der ProfilePage

Die Profilseite wurde deutlich erweitert.

## 7.1 Profilinformationen

Anzeige von:

- Benutzername
- E-Mail

---

## 7.2 Erstellte Events

- zeigt nur zukünftige Events
- Suchleiste integriert
- Button zum Einblenden vergangener Events

---

## 7.3 Beigetretene Events

- zeigt nur zukünftige Events
- Suchleiste integriert
- Button zum Einblenden vergangener Events

---

## 7.4 Vergangene Events

- werden standardmäßig nicht angezeigt
- erscheinen erst nach Klick
- sorgen für bessere Übersicht

---

## 7.5 Sortierung

Alle Events werden sortiert nach:

- frühester Beginn zuerst
- spätere Events danach

---

# 8. Refactor der EventDetailPage

## Änderungen

- strukturiertes Layout
- Nutzung von EventMeta
- Teilnehmeranzeige verbessert
- Edit-Modus integriert
- klare Aktionsbuttons

## Teilnehmeranzeige

- Teilnehmeranzahl sichtbar
- Liste der Teilnehmer
- standardmäßig gekürzt
- erweiterbar

## Join / Leave Logik

- basiert auf is_joined
- zeigt passende Aktionen

## Creator Verhalten

Der Creator kann:

- joinen
- verlassen
- bearbeiten
- löschen

---

# 9. Event teilen

Neue Funktion:

- Button zum Kopieren des Event-Links
- Link wird in die Zwischenablage kopiert
- Feedback für den Nutzer

---

# 10. Architekturverbesserungen

## Trennung von UI und Logik

Komponenten ausgelagert:

- EventCard
- EventMeta
- ParticipantsPreview
- LoadingState
- EmptyState
- PageContainer

---

## Wiederverwendbarkeit

- UI wird mehrfach genutzt
- weniger Duplikation

---

## Konsistenz

- gleiche Struktur auf allen Seiten
- gleiche Komponenten
- gleiche UX

---

# 11. UX Verbesserungen

- bessere Übersicht der Events
- Teilnehmer direkt sichtbar
- klarere Profilstruktur
- bessere Navigation
- intuitivere Bedienung

---

# 12. Ergebnis

Das Frontend ist jetzt:

- modular
- konsistent
- wartbar
- skalierbar

---

# 13. Nächste mögliche Schritte

## UI

- Status-Badges (bevorstehend / vergangen)
- EventCard weiter verbessern

## Architektur

- AuthContext einführen
- State Management verbessern

## Features

- Pagination
- bessere Filter
- Sortierung erweitern

---

# Zusammenfassung

In diesem Abschnitt wurde das Frontend grundlegend verbessert.

Wichtige Punkte:

- Chakra UI Integration
- modulare Komponentenstruktur
- verbesserte Navigation
- erweiterte Profilseite
- Teilnehmer-Vorschau
- Event teilen Funktion

Das Frontend ist jetzt auf einem stabilen und skalierbaren Stand.
