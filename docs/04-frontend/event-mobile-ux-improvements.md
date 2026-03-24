# 📱 Event & Mobile UX Improvements – Dokumentation

## 📅 Überblick

Diese Dokumentation beschreibt alle Änderungen und Verbesserungen ab der Anpassung der Event-Suche bis hin zur mobilen UX-Optimierung inklusive Navbar und Scroll-To-Top-Feature.

---

# 🔍 1. Event-Suche überarbeitet

## ❌ Entfernt

- Datumsfelder:
  - `Beginn ab`
  - `Beginn bis`

## ✅ Neu

- Zeitraum-Filter via Dropdown

### Filteroptionen:

- Alle
- 24h
- 1 Woche
- 2 Wochen
- 1 Monat
- 3 Monate
- 6 Monate
- später (> 6 Monate)

## 🧠 Logik

```ts
function getDateRangeFromFilter(range);
```

- `date_to` → für kommende Events
- `date_from` → für "später"
- leer → zeigt alle Events

---

# 🕰️ 2. Verhalten "Alle Events"

## Änderung

Wenn "Alle" ausgewählt ist:

- `onlyFuture = false`

## Ergebnis

- Auch vergangene Events werden angezeigt

---

# 📦 3. Pagination / "Mehr anzeigen"

## Ziel

- Performance verbessern
- UI übersichtlich halten

## Umsetzung

```ts
const EVENTS_STEP = 6;
const [visibleCount, setVisibleCount] = useState(EVENTS_STEP);
```

## Buttons

### Mehr anzeigen

- Zeigt +6 Events

### Weniger anzeigen

- Entfernt 6 Events

## Bedingungen

```ts
const canShowMore = visibleCount < events.length;
const canShowLess = visibleCount > EVENTS_STEP;
```

## Verhalten

| Zustand     | Button           |
| ----------- | ---------------- |
| > 6 Events  | Mehr anzeigen    |
| erweitert   | Weniger anzeigen |
| <= 6 Events | kein Button      |

---

# 🧩 4. Grid-Layout verbessert

## Desktop

- 2 EventCards pro Zeile

```tsx
<SimpleGrid columns={{ base: 1, lg: 2 }} />
```

## Mobile

- 1 Card pro Zeile

---

# 👤 5. Profilseite verbessert

## Neue Features

### 1. Collapsible für Events

- Beigetretene Events einklappbar
- Erstellte Events einklappbar

### 2. Gleiche Pagination wie EventsPage

- 6 Cards initial
- Mehr/Weniger anzeigen

### 3. Grid angepasst

- Desktop: 2 Cards
- Mobile: 1 Card

---

# 📱 6. Navbar komplett überarbeitet

## Desktop

- Sticky Navbar
- Saubere horizontale Struktur
- Keine Zeilenumbrüche

---

## Mobile (neues Konzept)

### Struktur:

### 🔹 Zeile 1

- Username + Badge (links)
- Logo (zentriert)
- Toggle + Logout (rechts)

### 🔹 Zeile 2 (Sticky)

- Bereich
- Suchen
- Erstellen

---

## ✨ Zentriertes Logo (wichtige Verbesserung)

### Problem:

Logo war nicht wirklich mittig

### Lösung:

```tsx
position: absolute;
left: 50%;
transform: translateX(-50%);
```

### Ergebnis:

- Perfekt zentriert
- unabhängig von Button-Breiten

---

## 📌 Sticky Navigation (Mobile)

```tsx
position = "sticky";
top = "0";
zIndex = "sticky";
```

Nur:

- Bereich
- Suchen
- Erstellen

---

# 🎨 7. Dark / Light Mode Logo

## Umsetzung

```ts
const isDark = resolvedTheme !== "light";
const logoSrc = isDark ? logoDark : logoLight;
```

## Ergebnis

- Darkmode → default.svg
- Lightmode → default_light.svg

---

# ⬆️ 8. Scroll-To-Top Button (Mobile UX Feature)

## Neue Komponente

Pfad:

```
src/components/ui/ScrollToTopButton.tsx
```

## Features

- nur Mobile sichtbar
- erscheint ab 300px Scroll
- smooth scroll nach oben
- floating bottom-left

---

## Code-Verhalten

```ts
window.scrollTo({
  top: 0,
  behavior: "smooth",
});
```

---

## Anzeige-Logik

```ts
if (!isMobile || !visible) return null;
```

---

## Position

```tsx
position = "fixed";
bottom = "16px";
left = "16px";
```

---

## Integration

In:

```
AppLayout.tsx
```

```tsx
<ScrollToTopButton />
```

---

# 🚀 Ergebnis

## UX Verbesserungen

- deutlich bessere Mobile-Navigation
- schneller Zugriff auf Top
- weniger visuelles Chaos
- konsistente UI

## Performance

- weniger DOM durch Pagination
- effizienteres Rendering

## Design

- moderner
- cleaner
- responsiver

---

# 📌 Fazit

Die App hat jetzt:

- eine klare Mobile-Strategie
- bessere Event-Navigation
- saubere Komponentenstruktur
- konsistente UX über alle Seiten

---
