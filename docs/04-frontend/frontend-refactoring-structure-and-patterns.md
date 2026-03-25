# Frontend Refactoring – Structure & Patterns

## Ziel des Refactorings

Dieses Refactoring hatte folgende Ziele:

- bessere **Übersichtlichkeit**
- klare **Trennung von Logik und UI**
- Wiederverwendbarkeit von Komponenten
- bessere **Performance & Wartbarkeit**
- Vorbereitung für zukünftige Features

---

# 🧱 1. Grundprinzipien des neuen Frontend-Aufbaus

## 1.1 Trennung von Verantwortlichkeiten

| Bereich    | Aufgabe                              |
| ---------- | ------------------------------------ |
| Pages      | Orchestrieren Daten + Layout         |
| Hooks      | API-Logik + State                    |
| Components | Reine UI                             |
| Forms      | Wiederverwendbare Eingabekomponenten |

---

## 1.2 Struktur (vereinfacht)

```
components/
  common/
  events/
  eventDetail/
  ui/

pages/
  EventsPage.tsx
  EventDetailPage.tsx
  ProfilePage.tsx

hooks/
  useEventDetail.ts
```

---

# 🎯 2. EventsPage Refactoring

## Vorher

- Alles in einer Datei
- Filter + API + UI gemischt

## Nachher

### Verbesserungen

- Debounced Suche
- klare Filterlogik
- Pagination isoliert

### Logik-Trennung

- `getDateRangeFromFilter`
- `useMemo` für sichtbare Events

---

# 👤 3. ProfilePage Refactoring

## Verbesserungen

### 🔹 Account Management

- Username ändern
- Passwort ändern
- getrennte UI-Zustände

### 🔹 State-Struktur

- UI-State getrennt von Daten-State
- Ladezustände separat

### 🔹 UX Verbesserungen

- kein API-Call während Eingabe
- Validierung nur beim Submit

---

# 🎫 4. EventDetailPage Refactoring (größtes Refactoring)

## Aufteilung in Komponenten

| Komponente        | Aufgabe                      |
| ----------------- | ---------------------------- |
| EventDetailHeader | Titel + Meta                 |
| EventParticipants | Teilnehmerliste              |
| EventActions      | Buttons (Join, Edit, Delete) |
| EventEditForm     | Bearbeiten                   |

---

## 4.1 Custom Hook: useEventDetail

### Aufgaben

- Event laden
- User laden
- Actions kapseln:
  - join
  - leave
  - delete
  - update

### Vorteil

➡️ UI ist komplett entkoppelt von API

---

## 4.2 EventActions

### Logik ausgelagert:

- isCreator
- isAdmin
- is_joined

➡️ Page bleibt clean

---

## 4.3 EventParticipants

### Features

- Vorschau (3 Teilnehmer)
- Toggle "mehr anzeigen"

---

## 4.4 EventEditForm

### Neu:

- lokale Validierung
- Backend-Fehler handling
- wiederverwendbare Fields

---

# 🧩 5. Wiederverwendbare Form-Komponente

## EventFormFields

### Zweck

➡️ Vermeidung von doppeltem Code in:

- CreateEventPage
- EventEditForm

### Vorteile

- DRY Prinzip
- zentrale UI-Anpassung
- weniger Bugs

---

# 🧾 6. CreateEventPage Refactoring

## Änderungen

### Vorher

- komplett eigenständige Form

### Nachher

- nutzt `EventFormFields`

### Vorteile

- gleiche UI wie Edit
- weniger Code
- gleiche Validierung

---

# 🔐 7. Auth Pages Refactoring

## LoginPage & RegisterPage

### Verbesserungen

- saubere Fehlerbehandlung
- Loading States
- bessere UX

### RegisterPage

- Passwort-Check mit `useMemo`
- visuelles Feedback

---

# 🚪 8. AccessGate (nicht refactored)

➡️ bewusst unverändert gelassen
➡️ einfache Struktur ausreichend

---

# 🔔 9. Toast System (Chakra v3)

## Problem

- `useToast` existiert nicht mehr

## Lösung

### Custom Toaster

```ts
export const toaster = createToaster({...})
```

### Wichtig

➡️ `<Toaster />` muss global gerendert werden!

### Integration (AppLayout)

```tsx
<Toaster />
```

---

## Nutzung

```ts
toaster.create({
  title: "Link kopiert",
  type: "success",
});
```

---

# ⚠️ 10. Typische Fehler & Lösungen

## ❌ Fehler

```
Property 'title' does not exist on type 'LoginPageProps'
```

### Ursache

➡️ falscher Import (z. B. EventFormFields = LoginPage)

### Lösung

✔ richtigen Import prüfen

---

## ❌ useToast existiert nicht

➡️ Chakra v3 Änderung

✔ Lösung: `createToaster`

---

## ❌ Toaster zeigt nichts

➡️ `<Toaster />` nicht global eingebaut

---

## ❌ setState Fehler (Hooks)

➡️ Hooks nach return definiert

✔ immer ganz oben definieren

---

# 🚀 11. Ergebnis des Refactorings

## Verbesserungen

### ✔ Codequalität

- deutlich modularer
- besser lesbar

### ✔ UX

- weniger Bugs
- bessere Ladezustände

### ✔ Skalierbarkeit

- neue Features einfacher

### ✔ Wiederverwendbarkeit

- Form-Komponenten
- Hooks

---

# 🧠 Fazit

Das Frontend ist jetzt:

- komponentenbasiert
- logisch getrennt
- wartbar
- skalierbar

➡️ perfekte Basis für:

- Notifications
- Live Updates
- Advanced Filters
- User Features

---
