# Systemarchitektur

## 1. Ziel des Systems

Ziel dieses Projekts ist die Entwicklung einer Webplattform zur Organisation und Teilnahme an Musik-Events.

Nutzer der Plattform können:

- ein Benutzerkonto erstellen
- sich anmelden
- eigene Musik-Events erstellen
- verfügbare Events durchsuchen
- Events suchen und filtern
- bestehenden Events beitreten
- Events verwalten, die sie erstellt haben oder denen sie beigetreten sind

Der Fokus der ersten Version (MVP – Minimum Viable Product) liegt auf einer klaren und funktionalen Grundstruktur.
Die Architektur soll dabei einfach verständlich sein, gleichzeitig aber zukünftige Erweiterungen ermöglichen.

---

# 2. Systemübersicht

Die Anwendung besteht aus drei zentralen Komponenten:

1. **Frontend**
2. **Backend**
3. **Datenbank**

Jede dieser Komponenten übernimmt eine klar definierte Aufgabe.

```
Benutzer (Browser)
        ↓
React Frontend (Benutzeroberfläche)
        ↓ HTTP / REST API
FastAPI Backend (Geschäftslogik)
        ↓
PostgreSQL Datenbank (Datenspeicherung)
```

Das Frontend kommuniziert über HTTP-Anfragen mit dem Backend.
Das Backend verarbeitet die Anfragen, führt die Geschäftslogik aus und speichert oder liest Daten aus der Datenbank.

---

# 3. Hauptkomponenten

## 3.1 Frontend

Das Frontend wird mit **React und TypeScript** entwickelt und mit **Vite** gebaut.

Aufgaben des Frontends:

- Darstellung der Benutzeroberfläche
- Navigation und Routing zwischen Seiten
- Anzeige von Events und Nutzerdaten
- Bereitstellung von Formularen (z. B. Registrierung, Login, Event erstellen)
- Kommunikation mit der Backend-API
- Aktualisierung der Benutzeroberfläche anhand der API-Antworten

Das Frontend enthält **keine sicherheitskritische Logik**.
Validierung und Zugriffskontrollen werden im Backend durchgeführt.

---

## 3.2 Backend

Das Backend wird mit **FastAPI (Python)** implementiert.

Aufgaben des Backends:

- Bereitstellung von REST API-Endpunkten
- Authentifizierung von Nutzern
- Autorisierung von Aktionen (z. B. wer ein Event bearbeiten darf)
- Validierung eingehender Daten
- Umsetzung der Geschäftslogik
- Kommunikation mit der Datenbank
- Rückgabe strukturierter JSON-Antworten an das Frontend

Das Backend bildet die zentrale Logikschicht des Systems.

---

## 3.3 Datenbank

Als Datenbank wird **PostgreSQL** verwendet. (in Entwicklung zu Beginn SQLite)

Aufgaben der Datenbank:

- Speicherung von Benutzerkonten
- Speicherung von Event-Daten
- Speicherung der Beziehungen zwischen Nutzern und Events
- Sicherstellung der Datenintegrität durch Constraints und Beziehungen

Die Datenbankstruktur wird im Backend über **SQLAlchemy-Modelle** definiert.

---

# 4. Ablauf einer Anfrage (Request Flow)

Dieser Abschnitt beschreibt den typischen Ablauf einer Nutzeraktion im System.

### Beispiel: Event erstellen

1. Ein eingeloggter Nutzer öffnet im Frontend das Formular zur Event-Erstellung.
2. Der Nutzer gibt Informationen zum Event ein (Titel, Ort, Datum usw.).
3. Das Frontend sendet eine HTTP-POST-Anfrage an das Backend.
4. Das Backend überprüft die Authentifizierung des Nutzers.
5. Das Backend validiert die übermittelten Daten.
6. Das Backend speichert das Event in der Datenbank.
7. Das Backend sendet eine Bestätigung als Antwort zurück.
8. Das Frontend aktualisiert die Benutzeroberfläche entsprechend.

---

# 5. Architekturprinzipien

Die Architektur dieses Projekts basiert auf mehreren grundlegenden Prinzipien.

### Trennung der Verantwortlichkeiten (Separation of Concerns)

Jede Systemschicht hat eine klar definierte Aufgabe:

- **Frontend:** Darstellung und Benutzerinteraktion
- **Backend:** Logik, Validierung und Zugriffskontrolle
- **Datenbank:** dauerhafte Speicherung von Daten

Diese Trennung verbessert Wartbarkeit, Erweiterbarkeit und Testbarkeit des Systems.

---

### Modularer Monolith

Das Backend wird als **modularer Monolith** implementiert.

Das bedeutet:

- die Anwendung läuft als eine zusammenhängende Backend-Anwendung
- einzelne Funktionsbereiche werden intern in Module aufgeteilt
- das System bleibt übersichtlich und einfach zu entwickeln

Dieser Ansatz wurde gewählt, weil er:

- die Komplexität für das MVP reduziert
- schnelle Entwicklungszyklen ermöglicht
- leichter verständlich ist als eine Microservice-Architektur

Bei Bedarf kann das System später in mehrere Services aufgeteilt werden.

---

### REST-basierte Kommunikation

Die Kommunikation zwischen Frontend und Backend erfolgt über eine **REST API**.

Vorteile dieses Ansatzes:

- klare Struktur von Requests und Responses
- standardisierte HTTP-Methoden (GET, POST, PATCH, DELETE)
- gute Integration mit modernen Frontend-Frameworks
- einfache Testbarkeit und Debugging

---

# 6. Umfang des Minimum Viable Product (MVP)

Die erste Version der Plattform konzentriert sich auf die Kernfunktionalität.

Enthaltene Funktionen:

- Registrierung von Nutzern
- Login und Authentifizierung
- Erstellen von Events
- Anzeige verfügbarer Events
- Suche und Filter für Events
- Beitreten zu Events
- Verlassen von Events
- persönliche Nutzerübersicht

Bewusst **nicht Teil des MVP**:

- Messaging zwischen Nutzern
- Ticketing oder Bezahlfunktionen
- Bild-Uploads
- Benachrichtigungssystem
- komplexe Rollen- oder Rechteverwaltung
- Admin-Dashboard

Diese Funktionen können später ergänzt werden.

---

# 7. Mögliche zukünftige Erweiterungen

Die Architektur wurde so gewählt, dass spätere Erweiterungen möglich sind.

Mögliche Erweiterungen:

- E-Mail-Verifikation
- Passwort-Reset
- erweiterte Suchfunktionen
- Full-Text-Suche für Events
- Upload von Eventbildern
- Benachrichtigungen für Nutzer
- rollenbasierte Zugriffskontrolle
- Empfehlungssysteme
- Kommentare oder Diskussionen zu Events

Diese Funktionen können schrittweise integriert werden.

---

# 8. Zusammenfassung

Die Plattform basiert auf einer klar strukturierten Webarchitektur:

- **Frontend:** React + TypeScript
- **Backend:** FastAPI (Python)
- **Datenbank:** PostgreSQL
- **Kommunikation:** REST API

Die Anwendung wird zunächst als **modularer Monolith** entwickelt, um eine schnelle und verständliche Entwicklung zu ermöglichen.
Die Struktur erlaubt jedoch eine spätere Erweiterung und Skalierung des Systems.
