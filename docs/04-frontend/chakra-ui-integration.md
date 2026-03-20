# Chakra UI Integration & Frontend Refactor

Dieses Dokument beschreibt die Einführung von Chakra UI im Frontend sowie die Umstrukturierung und Verbesserung der UI-Architektur.

Die Integration erfolgte nach der vollständigen Umsetzung der Authentifizierung und der Event-Funktionalität.

---

# 1. Ziel der Integration

Ziel war es, das Frontend:

- visuell konsistenter
- besser strukturiert
- leichter erweiterbar
- moderner und nutzerfreundlicher

zu gestalten.

Zusätzlich sollte die Codebasis verbessert werden durch:

- Wiederverwendbarkeit von Komponenten
- klarere Trennung von Layout und Logik
- bessere Lesbarkeit

---

# 2. Was ist Chakra UI?

Chakra UI ist eine React-Komponentenbibliothek.

Sie bietet:

- vorgefertigte UI-Komponenten (Button, Input, Box, etc.)
- Styling direkt über Props
- konsistente Design-Systeme
- schnelle UI-Entwicklung ohne eigenes CSS

---

# 3. Integration in das Projekt

Chakra wurde in das bestehende React + TypeScript Projekt integriert.

## Grundidee

- Chakra ersetzt manuelles Styling (inline styles, CSS)
- Komponenten werden direkt über Props gestaltet

---

# 4. Neue Architektur im Frontend

## Einführung eines globalen Layouts

Neue Datei:
