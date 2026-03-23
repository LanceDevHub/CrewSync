# Profile, Suche und Event-UI Updates

Dieses Dokument beschreibt die Weiterentwicklung der Event-Suche, der Profilseite sowie der Event-Karten und Event-Details im Frontend.

Der dokumentierte Fortschritt beginnt bei der Vereinfachung der Event-Suche und endet bei der visuellen Verbesserung von EventCard und EventDetailPage.

---

# 1. Vereinfachung der Event-Suche

Die Event-Suche auf der Events-Seite wurde vereinfacht und benutzerfreundlicher gemacht.

## Vorher

Die Seite enthielt mehrere Filter:

- Textsuche
- Ort / Location
- Zeitraum von
- Zeitraum bis
- Checkbox für zukünftige Events
- separaten Button zum Anwenden der Filter

## Problem

Die Suchmaske war zu schwergewichtig und verlangte zu viele manuelle Schritte.

Insbesondere:

- zu viele Filter gleichzeitig
- unnötiger Suchbutton
- zu hohe Reibung für einfache Suchanfragen

---

## Neue Struktur

Die Suche fokussiert sich jetzt auf:

- Textsuche
- Zeitraum von
- Zeitraum bis
- Nur zukünftige Events

Entfernt wurde:

- eigener Location-Filter

---

## UX-Verbesserungen

### Automatische Suche

Die Suche wird jetzt automatisch ausgelöst, sobald sich ein Suchwert ändert.

Das bedeutet:

- kein expliziter Suchbutton mehr notwendig
- direkteres Verhalten
- weniger Klicks

### Debounce

Damit nicht bei jedem Tastendruck sofort ein Request gesendet wird, wurde eine kleine Verzögerung eingebaut.

Vorteil:

- weniger API-Requests
- ruhigeres Suchverhalten
- bessere Performance

### Standardwert für zukünftige Events

Die Option:

- Nur zukünftige Events

ist jetzt standardmäßig aktiviert.

Dadurch sehen Nutzer beim ersten Laden direkt die relevantesten Events.

---

## Reset der Suche

Zusätzlich wurde ein Reset-Button eingeführt, der folgende Felder zurücksetzt:

- Textsuche
- Beginn ab
- Beginn bis
- Nur zukünftige Events zurück auf Standardwert `true`

Ein kleines Problem mit `datetime-local` Inputs wurde dabei behoben, indem die Werte sauber als kontrollierte Inputs mit leerem String behandelt werden.

---

# 2. Upgrade der Profilseite

Die Profilseite wurde strukturell und visuell überarbeitet.

Ziel war es, die Seite übersichtlicher, hochwertiger und besser nutzbar zu machen.

---

## 2.1 Neuer Profile Header

Der obere Bereich der Profilseite wurde in eine eigene Header-Card umgebaut.

Enthalten sind jetzt:

- Avatar
- voller Name
- Username
- E-Mail
- Admin-Badge

### Vorteil

- persönlicherer Eindruck
- klarere visuelle Hierarchie
- professionelleres Erscheinungsbild

---

## 2.2 Reihenfolge der Event-Bereiche

Die Reihenfolge der Event-Sektionen wurde angepasst.

Jetzt gilt:

1. Beigetretene Events
2. Erstellte Events

### Grund

Beigetretene Events sind für Nutzer im Alltag meist relevanter und sollten daher zuerst sichtbar sein.

---

## 2.3 Trennung zwischen aktuellen und vergangenen Events

Sowohl bei beigetretenen als auch bei erstellten Events wird weiterhin unterschieden zwischen:

- aktuell
- vergangen

Diese Trennung wurde jedoch UX-seitig verbessert.

---

## 2.4 Neue Steuerlogik statt verwirrender Buttons

Die frühere Lösung mit mehreren Buttons wie:

- Bereich anzeigen
- vergangene anzeigen
- vergangene ausblenden

war visuell unruhig und auf Mobile unübersichtlich.

### Neue Lösung

#### Beigetretene Events

- immer geöffnet
- Suchfeld sichtbar
- Umschaltung über kleine View-Toggles:
  - Aktuell
  - Vergangen

#### Erstellte Events

- initial eingeklappt
- Öffnen über eine klare Header-Zeile
- nach dem Öffnen ebenfalls View-Toggles:
  - Aktuell
  - Vergangen

---

## 2.5 Vorteil der neuen Profilstruktur

Die neue Logik erzeugt:

- weniger springende UI
- bessere Mobile-Nutzung
- klarere Nutzerführung
- ruhigere Darstellung

---

# 3. EventCard visuell verbessert

Die EventCard wurde visuell überarbeitet, um moderner und klarer zu wirken.

---

## 3.1 Verbesserungen an der Card

Die Karten wurden aufgewertet durch:

- größere Border-Radien
- feinere Schatten
- klarere Abstände
- optische Trennung von Meta-Informationen
- ruhigere Struktur

---

## 3.2 Bessere Informationshierarchie

Die Card zeigt jetzt klarer getrennt:

- Titel
- kompaktes Line-up
- Meta-Infos
- Teilnehmer-Vorschau
- Link zur Detailseite

Dadurch ist schneller erfassbar, was wichtig ist.

---

# 4. Line-up Darstellung verbessert

Ein wichtiger Teil der Überarbeitung war die Darstellung des Line-ups.

---

## 4.1 EventCard: kompaktes Preview

In der EventCard wird das Line-up jetzt bewusst stark komprimiert dargestellt.

### Regel

- maximal 3 Artists
- wenn mehr vorhanden sind:
  - `Artist 1, Artist 2, Artist 3, ...`

### Vorteil

- Card bleibt kompakt
- keine zu langen Textblöcke
- bessere Scanbarkeit in Listen

---

## 4.2 EventDetailPage: kompakter, aber vollständig

Auf der Detailseite wurde das Line-up ebenfalls überarbeitet.

### Vorher

- jeder Artist als eigener Block untereinander

### Problem

- bei vielen Artists wurde die Event-Card sehr lang
- die Seite wirkte unnötig gestreckt

### Neue Lösung

Das Line-up wird jetzt als kompakte Badge-/Chip-Darstellung gerendert:

- jeder Artist als kleines visuelles Element
- automatisch umbrechend
- alle Artists sichtbar
- deutlich platzsparender als eine lange vertikale Liste

### Vorteil

- vollständige Information bleibt erhalten
- kompaktere Detailansicht
- modernere Optik

Da in der Regel nicht mehr als acht Artists vorkommen, wurde bewusst auf eine zusätzliche „Mehr anzeigen“-Logik verzichtet.

---

# 5. EventDetailPage allgemein verbessert

Neben dem Line-up wurde auch die gesamte visuelle Struktur der Detailseite verbessert.

---

## 5.1 Ruhigere Kartenstruktur

Die einzelnen Bereiche wurden klarer als eigene Cards dargestellt:

- Event-Info
- Teilnehmer
- Aktionen

### Vorteil

- bessere Trennung der Inhalte
- hochwertigerer Gesamteindruck
- leichtere Orientierung

---

## 5.2 Meta-Bereich besser abgesetzt

Die Event-Metadaten wie:

- Ersteller
- Ort
- Beginn
- Ende

werden jetzt in einem eigenen, leicht abgesetzten Bereich dargestellt.

Dadurch wirken die Informationen strukturierter.

---

# 6. Ende-Datum nur noch bei echtem Wert anzeigen

Ein weiterer wichtiger Punkt war die Behandlung von `end_datetime`.

## Vorher

Auch wenn kein Enddatum vorhanden war, wurde teilweise eine leere oder Platzhalter-Zeile angezeigt.

## Neue Lösung

Die Zeile für:

- Ende

wird jetzt nur noch gerendert, wenn `end_datetime` tatsächlich gesetzt ist.

### Vorteil

- sauberere UI
- keine unnötigen Platzhalter
- fachlich korrektere Darstellung

Diese Logik gilt sowohl für:

- EventCard / EventMeta
- EventDetailPage

---

# 7. Ergebnis der Änderungen

Nach diesen Anpassungen ergibt sich folgender Stand:

## Event-Suche

- weniger Filter
- automatische Suche
- nur zukünftige Events standardmäßig aktiv
- funktionierender Reset

## Profilseite

- hochwertiger Profilkopf
- bessere Reihenfolge der Inhalte
- klarere Trennung zwischen aktuellen und vergangenen Events
- bessere Mobile-UX
- deutlich ruhigere Steuerung

## EventCard

- optisch verbessert
- kompakteres Line-up
- klarere Hierarchie

## EventDetailPage

- schönere Kartenstruktur
- vollständiges, aber kompaktes Line-up
- Enddatum nur bei vorhandenem Wert

---

# 8. Nächste sinnvolle Schritte

Auf Basis dieses Fortschritts wären sinnvolle nächste UX-Schritte:

- Datumsdarstellung weiter verbessern, z. B. „Heute“ / „Morgen“
- Dark Mode integrieren
- globale Farb- und Font-Anpassung
- Logo einbauen
- EventCards weiter verfeinern

---

# Zusammenfassung

In diesem Abschnitt wurde das Frontend an mehreren zentralen Stellen weiter verbessert.

Besonders wichtig waren:

- die Vereinfachung der Event-Suche
- die strukturelle Überarbeitung der Profilseite
- die visuelle Verbesserung von EventCard und EventDetailPage
- die kompaktere und hochwertigere Darstellung des Line-ups
- die saubere Behandlung optionaler Enddaten
