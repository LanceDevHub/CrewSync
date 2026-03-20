# Chakra UI Integration & Frontend Refactor

Dieses Dokument beschreibt die Integration von Chakra UI sowie die Verbesserung der UI-Architektur im Frontend.

Die Integration erfolgte nach der vollständigen Umsetzung von Authentifizierung und Event-Funktionalität.

---

# 1. Ziel der Integration

Ziel war es, das Frontend:

- visuell konsistenter zu gestalten
- besser zu strukturieren
- leichter erweiterbar zu machen
- moderner und benutzerfreundlicher zu entwickeln

Zusätzlich sollte der Code verbessert werden durch:

- Wiederverwendbarkeit von Komponenten
- klare Trennung von Layout und Logik
- bessere Lesbarkeit

---

# 2. Was ist Chakra UI?

Chakra UI ist eine React-Komponentenbibliothek.

Sie bietet:

- vorgefertigte UI-Komponenten (Button, Input, Box, etc.)
- Styling über Props statt CSS
- konsistente Design-Systeme
- schnelle UI-Entwicklung

---

# 3. Integration ins Projekt

Chakra wurde in das bestehende React + TypeScript Projekt integriert.

Grundidee:

- Chakra ersetzt manuelles Styling
- UI wird über Komponenten aufgebaut
- weniger eigenes CSS notwendig

---

# 4. Neue Frontend-Struktur

## 4.1 AppLayout

Datei:

src/components/layout/AppLayout.tsx

Aufgabe:

- globales Layout
- Navigation einbinden
- Wrapper für alle Seiten

---

## 4.2 Navbar

Datei:

src/components/layout/Navbar.tsx

Aufgabe:

- zentrale Navigation
- einfache Erweiterbarkeit
- später: Anzeige abhängig vom Login-Status

---

# 5. Umstellung bestehender Seiten

Folgende Seiten wurden auf Chakra umgestellt:

- LoginPage
- RegisterPage
- EventsPage
- EventDetailPage
- CreateEventPage
- ProfilePage

---

# 6. Verwendete Chakra Komponenten

## 6.1 Layout

- Box -> Container (ersetzt div)
- Stack -> automatische Abstände
- SimpleGrid -> responsive Layouts

---

## 6.2 Formulare

- Field.Root
- Field.Label
- Input
- Textarea
- Button

Vorteile:

- einheitliche Darstellung
- weniger Styling-Aufwand
- bessere UX

---

## 6.3 Feedback

- Alert

Verwendung für:

- Fehleranzeigen
- Erfolgsmeldungen
- Backend-Validierung

---

# 7. Wichtige technische Besonderheit

## Chakra + React Router

Problem:

Button oder Link mit "to" führt zu TypeScript Fehlern:

<Button as={Link} to="/events" />

---

## Lösung: asChild

Richtige Verwendung:

<Button asChild>
  <RouterLink to="/events">Events</RouterLink>
</Button>

oder:

<Link asChild>
  <RouterLink to="/events/1">Details</RouterLink>
</Link>

---

## Warum?

- Chakra rendert eigene HTML Elemente
- React Router benötigt spezielle Props wie "to"
- asChild übergibt die Kontrolle an RouterLink

---

## Merksatz

Bei Navigation mit Chakra immer asChild verwenden

---

# 8. Verbesserungen durch Chakra

Vorher:

- viele Inline Styles
- uneinheitliches Layout
- schwer wartbar

Nachher:

- konsistentes Design
- klare Struktur
- weniger Code
- bessere Lesbarkeit

---

# 9. UX Verbesserungen

- klar strukturierte Formulare
- bessere visuelle Hierarchie
- konsistente Abstände
- übersichtlichere Event-Darstellung
- bessere Button-Erkennbarkeit

---

# 10. Wiederverwendbare Patterns

## Kartenlayout

<Box bg="white" p="6" borderRadius="lg" boxShadow="sm">

---

## Seitenstruktur

<Stack gap="6">

---

## Formulare

<Field.Root>

---

Diese Patterns sollten im gesamten Projekt einheitlich verwendet werden.

---

# 11. Wichtige Erkenntnisse

## UI und Logik sind getrennt

- Chakra ist nur für Darstellung zuständig
- Business-Logik bleibt unverändert

---

## Backend bleibt unverändert

- keine Anpassung der API notwendig
- nur Frontend wurde angepasst

---

## Konsistenz ist entscheidend

- gleiche Komponenten = gleiche UX
- gleiche Abstände = ruhiges Layout

---

## Komponentenstruktur wird wichtiger

- Wiederverwendung nimmt zu
- Komponenten sollten ausgelagert werden

---

# 12. Offene Verbesserungen

## UI

- EventCard Komponente erstellen
- Theme anpassen
- optional Dark Mode

---

## Architektur

- AuthContext einführen
- globales State Management verbessern

---

## UX

- Navigation abhängig vom Login
- bessere Loading States
- bessere Empty States

---

# 13. Fazit

Durch Chakra UI wurde:

- die UI deutlich verbessert
- die Codequalität erhöht
- die Wartbarkeit gesteigert
- eine skalierbare Grundlage geschaffen

Die Anwendung ist jetzt:

- funktional
- visuell konsistent
- strukturell sauber

---

# 14. Wichtig für die Zukunft

- Chakra konsequent nutzen
- Navigation immer mit asChild
- Komponenten früh extrahieren
- Layout zentral halten

---

# Zusammenfassung

Chakra UI bildet die Grundlage für:

- skalierbare UI-Entwicklung
- konsistentes Design
- bessere User Experience

Das Frontend ist jetzt bereit für die nächste Entwicklungsphase.
