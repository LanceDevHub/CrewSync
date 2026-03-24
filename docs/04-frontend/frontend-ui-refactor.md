# CrewSync Frontend – UI & Theme Refactoring Dokumentation

## Überblick

In dieser Session wurde das Frontend visuell und strukturell stark verbessert.

Der Fokus lag auf:

- Vereinheitlichung der Buttons
- Einführung eines Design Systems
- Dark Mode Integration
- Refactoring mehrerer Seiten auf Theme Tokens
- Verbesserung von EmptyState und LoadingState
- Überarbeitung der Navbar für Desktop und Mobile
- Responsive Optimierungen
- Dynamisches Logo je nach Color Mode

---

# 1. Einführung eines zentralen Button-Systems

## Ziel

Vorher wurden Buttons an vielen Stellen einzeln mit Chakra Props gestaltet.  
Das führte zu:

- inkonsistentem Verhalten
- unterschiedlichen Farben und Varianten
- höherem Pflegeaufwand

## Umsetzung

Es wurde eine zentrale Komponente `AppButton` eingeführt.

Diese kapselt:

- Varianten
- Größe
- Radius
- Hover- und Active-Verhalten
- Danger-, Primary-, Secondary- und Ghost-Use-Cases

## Varianten

- `primary` → Hauptaktionen
- `secondary` → Standardaktionen
- `danger` → kritische Aktionen (z. B. Logout, Löschen)
- `ghost` → subtile UI-Aktionen

## Ergebnis

- Konsistentes Verhalten aller Buttons
- Weniger Wiederholungen im Code
- Spätere Änderungen an einer zentralen Stelle möglich

---

# 2. Einführung eines Design Systems im Theme

## Ziel

Vorher wurden viele harte Farben direkt in Komponenten verwendet, z. B.:

- white
- gray.50
- gray.600
- teal.500

Das sollte durch ein zentrales Theme ersetzt werden.

## Umsetzung

In `theme.ts` wurden Tokens und Semantic Tokens aufgebaut.

### Wichtige Tokens

- Schriftart: Raleway
- Brand-Farben
- Light- und Dark-spezifische Basisfarben

### Wichtige Semantic Tokens

- `bg`
- `surface`
- `mutedBg`
- `text`
- `textMuted`
- `border`
- `brandAccent`
- `brandAccentHover`
- `brandAccentActive`

## Ergebnis

Alle Komponenten können jetzt über Theme Tokens gestylt werden, statt harte Farben zu setzen.

---

# 3. Anpassung der Brand-Farbe

## Entscheidung

Die ursprüngliche helle Neonfarbe machte im Light Mode als primäre UI-Farbe wenig Sinn.

Deshalb wurde umgestellt:

- Light Mode: dunkleres Grün als Primärfarbe
- Dark Mode: hellere Accent-Farbe weiterhin möglich

## Ergebnis

Die App wirkt im Light Mode ruhiger und hochwertiger, im Dark Mode weiterhin atmosphärisch.

---

# 4. Dark Mode Integration

## Ziel

Die App sollte vollständig zwischen Light und Dark Mode umschaltbar sein.

## Umsetzung

Es wurde `next-themes` genutzt.

Der Color Mode Provider wurde so eingerichtet, dass standardmäßig der Dark Mode aktiv ist.

Wichtige Konfiguration:

- Default Theme: dark
- System Theme: deaktiviert
- Theme wird gespeichert

## Ergebnis

- App startet standardmäßig im Dark Mode
- Nutzer kann manuell umschalten
- Semantic Tokens reagieren automatisch

---

# 5. Color Mode Button / Toggle

## Ausgangspunkt

Der Default Toggle war funktional, ging visuell aber im Dark Mode etwas unter.

## Umsetzung

Der `ColorModeButton` wurde in die Navbar integriert und visuell verbessert.

Ziel war:

- gute Sichtbarkeit
- konsistente Einbindung ins Design-System
- klare Positionierung

## Ergebnis

- Theme Toggle ist in der Navbar erreichbar
- passt besser zum restlichen UI
- Dark Mode kann schnell umgeschaltet werden

---

# 6. Refactoring der Seiten auf Theme Tokens

Mehrere Seiten wurden von harten Farben auf Theme Tokens umgestellt.

## Betroffene Seiten

- EventsPage
- EventDetailPage
- ProfilePage
- CreateEventPage
- LoginPage
- RegisterPage
- AccessGatePage

## Ersetzungen

### Vorher

- `bg="white"`
- `color="gray.600"`
- `borderColor="gray.200"`
- `colorPalette="teal"`

### Nachher

- `bg="surface"`
- `color="text"`
- `color="textMuted"`
- `borderColor="border"`
- Brand-Farben aus Theme

## Ergebnis

- einheitliche Darstellung
- Dark Mode kompatibel
- visuelle Konsistenz über alle Seiten

---

# 7. EventDetailPage Refactoring

## Änderungen

- große Bereiche auf `surface` umgestellt
- Meta-Box auf `mutedBg`
- Buttons durch `AppButton` ersetzt
- Offizielle Eventseite nutzt `brandAccent`
- Teilnehmerkarten und Lineup-Tags an Theme angepasst
- Enddatum wird weiterhin nur angezeigt, wenn vorhanden

## Button-Mapping

- Join → `primary`
- Leave → `secondary`
- Edit → `secondary`
- Delete → `danger`
- Share → `secondary`

## Ergebnis

Die Detailseite ist konsistent mit dem neuen UI-System und Dark Mode kompatibel.

---

# 8. ProfilePage Refactoring

## Änderungen

- Header Card mit Theme Tokens
- Sections für beigetretene und erstellte Events vereinheitlicht
- Buttons auf `AppButton` umgestellt
- Toggle/Collapse-Struktur für erstellte Events verbessert
- Suche und Event-Listen an neues Card-System angepasst

## Besondere UX-Entscheidung

Die erstellten Events bleiben einklappbar, damit die Seite übersichtlich bleibt.

## Ergebnis

Die Profilseite wirkt strukturierter und konsistenter.

---

# 9. Verbesserung von EmptyState und LoadingState

## Problem

Beide Komponenten nutzten noch weiße Hintergründe und Standardfarben.

## Anpassungen

### EmptyState

- `bg="surface"`
- `borderColor="border"`
- `color="textMuted"`
- zentrierte Darstellung

### LoadingState

- ebenfalls `surface`
- Spinner nutzt `brandAccent`
- Text nutzt `textMuted`

## Ergebnis

Auch diese System-Komponenten passen jetzt ins Design System.

---

# 10. Fixes für Dark Mode Probleme

## Problem 1

Einige Boxen blieben im Dark Mode weiß.

### Lösung

Weiße Hintergründe wurden durch `surface` ersetzt.

## Problem 2

Input-Text war im Dark Mode schwarz und daher schlecht lesbar.

### Lösung

Inputs bekamen:

- `color="text"`
- Placeholder in `textMuted`
- Focus Border in `brandAccent`

## Problem 3

Heading- und Label-Texte auf der AccessGatePage waren schwarz.

### Lösung

- Heading → `color="text"`
- Field.Label → `color="text"`

## Ergebnis

Alle betroffenen Stellen sind jetzt auch im Dark Mode gut lesbar.

---

# 11. AccessGatePage Refactoring

## Änderungen

- Card auf `surface` umgestellt
- Border mit `border`
- Beschreibung auf `textMuted`
- Input-Farben und Fokus angepasst
- Button auf `AppButton` umgestellt

## Ergebnis

Die AccessGatePage ist jetzt Theme-kompatibel und Dark Mode tauglich.

---

# 12. LoginPage, RegisterPage und CreateEventPage Refactoring

## Änderungen

Alle drei Seiten wurden vereinheitlicht:

- `surface` statt weißem Hintergrund
- `border` statt Standardborder
- `textMuted` für Beschreibungen
- `AppButton` statt Chakra Button

## Ergebnis

Diese Seiten folgen jetzt derselben visuellen Sprache wie der Rest der App.

---

# 13. Navbar – grundlegendes Refactoring

Die Navbar war einer der größten Teile der Session.

## Ziele

- Bessere Reihenfolge
- Bessere Mobile UX
- Bessere Desktop UX
- Klarere responsive Logik
- Besseres Branding
- Integration des Theme Toggles

---

# 14. Entfernte Navbar-Elemente

## Zurück-Button entfernt

Der vorherige Zurück-Button wurde komplett entfernt, um die Navbar zu vereinfachen.

---

# 15. Reihenfolge der Navigation angepasst

Für eingeloggte Nutzer wurde die Reihenfolge bewusst geändert zu:

1. Mein Bereich
2. Event Suche
3. Event erstellen

## Mobile Labels

Auf kleinen Screens wurden die Texte verkürzt zu:

- Bereich
- Suchen
- Erstellen

## Ergebnis

Bessere Priorisierung und mehr Platz auf kleinen Geräten.

---

# 16. Logo in der Navbar vereinfacht

## Änderung

Der zusätzliche Text neben dem Logo wurde entfernt.

Es bleibt nur noch das Logo sichtbar.

## Grund

- spart Platz
- wirkt cleaner
- verbessert Mobile Layout

---

# 17. Dynamisches Logo je nach Theme

## Umsetzung

Die Navbar nutzt jetzt unterschiedliche Logos je nach aktivem Theme:

- Dark Mode → `default.svg`
- Light Mode → `default_light.svg`

Zusätzlich:

- Im Dark Mode bleibt der schwarze Shadow aktiv
- Im Light Mode wird kein unnötiger Shadow erzwungen

## Ergebnis

Das Branding wirkt in beiden Modi sauberer.

---

# 18. Responsive Navbar – Desktop und Mobile getrennt behandelt

## Problem

Ein einziges Layout für alle Screen-Größen führte zu gequetschten oder unruhigen Ansichten.

## Lösung

Es wurde bewusst zwischen Mobile- und Desktop-Darstellung unterschieden.

### Desktop

- horizontales Layout
- eine Zeile
- längere Buttons
- Navigation, Userinfo, Theme Toggle und Logout in einer klaren Reihe

### Mobile

- Logo oben zentriert
- darunter Hauptnavigation
- darunter Username + Badge + Theme + Logout

## Ergebnis

Beide Ansichten können unabhängig optimiert werden.

---

# 19. Mobile Navbar – Hauptnavigation verbessert

## Änderungen

Die drei Hauptbuttons auf Mobile wurden in gleich breite Spalten gesetzt.

Das sorgt für:

- saubere Verteilung
- gleichmäßige Breite
- bessere Tap Targets

## Ergebnis

Die Mobile Navigation wirkt klarer und weniger gequetscht.

---

# 20. Mobile Navbar – Username / Badge / Toggle / Logout

Dieser Bereich wurde mehrfach iteriert, bis eine passende Balance gefunden wurde.

## Finaler Stand

- Username links
- optionales Admin-Badge daneben
- Theme Toggle und Logout rechts
- bessere Abstände
- Username mit Ellipsis, falls zu lang

## Ergebnis

Die Zeile ist kompakter und ruhiger als vorher.

---

# 21. Desktop Navbar stabilisiert

## Problem

Zwischenzeitlich wurde die Desktop-Navigation durch `width="full"` auf Buttons beschädigt.

Das führte zu:

- übergroßem Button
- Überlauf nach rechts
- kaputtem Desktop Layout

## Lösung

`width="full"` wurde nur noch optional für Mobile genutzt.

Desktop blieb wieder kompakt.

## Ergebnis

Die Desktop Navbar ist wieder nah am vorherigen, bereits guten Stand.

---

# 22. Responsive Padding und Spacing

## Änderungen

Navbar Padding wurde dynamischer gemacht:

- kleiner auf Mobile
- größer auf Desktop

Außerdem wurden:

- Gaps auf Mobile reduziert
- Button-Höhen auf Mobile etwas kompakter gemacht
- Logo-Breite auf Mobile reduziert

## Ergebnis

Mehr Platz auf kleinen Screens ohne das Layout zu überladen.

---

# 23. Username Handling in der Navbar

## Problem

Lange Usernamen könnten das Layout sprengen.

## Lösung

Username nutzt jetzt:

- `whiteSpace="nowrap"`
- `overflow="hidden"`
- `textOverflow="ellipsis"`

## Ergebnis

Der Username bleibt lesbar, ohne das Layout zu zerstören.

---

# 24. Weitere allgemeine UI Verbesserungen

Neben den großen Theme- und Navbar-Änderungen wurden auch viele kleinere UI-Details bereinigt:

- Hover States vereinheitlicht
- Boxen und Cards konsistenter gemacht
- Input-Felder an Dark Mode angepasst
- Spacing verbessert
- visuelle Hierarchien klarer gemacht

---

# 25. Ergebnis der Session

Nach dieser Session hat das Frontend jetzt:

- ein deutlich klareres Design-System
- konsistente Buttons
- einen funktionierenden Dark Mode
- Theme-kompatible Seiten
- Theme-kompatible States
- eine deutlich bessere responsive Navbar
- dynamisches Branding abhängig vom Theme

Die Anwendung wirkt dadurch wesentlich näher an einem echten, produktionsnahen Produkt.

---

# 26. Mögliche nächste Schritte

Sinnvolle nächste Verbesserungen wären:

- globale Input-Styles im Theme
- globale Field Label Styles
- Accessibility / Focus States weiter verbessern
- Mobile Navbar weiter polishen
- Animationen für Theme Toggle und Hover States
- Design-System-Dokumentation separat auslagern
