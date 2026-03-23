# Teilnehmerdarstellung & UX-Verbesserungen

Dieses Dokument beschreibt die Entwicklung und Verbesserung der Darstellung von Teilnehmern (Event Participants) im Frontend.

---

# 1. Ausgangssituation

Zu Beginn wurden Teilnehmer lediglich als einfache Liste von Usernames dargestellt:

Beispiel:

lenny, max, anna

## Probleme

- keine persönliche Darstellung
- keine echten Namen sichtbar
- wirkt technisch und unpersönlich
- keine gute UX für reale Anwendung

---

# 2. Erste Verbesserung: Namen anzeigen

Im Backend wurden zusätzliche Felder ergänzt:

- first_name
- last_name

Dadurch konnten Teilnehmer nun strukturierter dargestellt werden.

---

# 3. Problem: Darstellung im UI

Vollständige Namen sind oft zu lang:

Maximilian Mustermann

## Nachteile

- zu viel Platzverbrauch
- unübersichtlich in Listen
- schlecht auf mobilen Geräten

---

# 4. Lösung: Kompakte Namensdarstellung

Neue Darstellung:

Max M.

## Format

first_name + erster Buchstabe von last_name

---

## Vorteile

- kompakt
- gut lesbar
- wirkt persönlicher als Username
- ideal für mobile Geräte

---

# 5. Erweiterung: Strukturierte Teilnehmerdaten

Backend liefert jetzt:

participants:

- username
- first_name
- last_name

participants_preview:

- Liste der ersten 3 Teilnehmer

participants_count:

- Anzahl aller Teilnehmer

---

# 6. Teilnehmer-Vorschau in Listen

In Event-Liste und Profilseite:

Max M., Anna K., Leo S.

Wenn mehr Teilnehmer:

Max M., Anna K., Leo S., ...

---

## Vorteil

- Nutzer sehen sofort Aktivität
- keine Detailseite notwendig
- bessere Übersicht

---

# 7. Problem: Hover ist nicht mobilfähig

Früherer Ansatz:

Hover → zeigt Details

## Problem

- funktioniert nicht auf Touch-Geräten
- schlechte UX auf Smartphones

---

# 8. Entscheidung: Mobile-First UX

Hover wurde verworfen.

Neue Strategie:

- Informationen direkt sichtbar machen
- oder über Klick/Navigation erreichbar

---

# 9. Detailseite: vollständige Teilnehmerliste

Auf der Event-Detailseite:

- vollständige Liste aller Teilnehmer
- expand / collapse möglich

---

## Anzeige

- Vorname + Nachname
- optional Username

---

# 10. Zukünftige Erweiterung: Avatar-System

Geplante Darstellung:

runde Avatar-Kreise mit Initialen

Beispiel:

[M] [A] [L]

---

## Vorteile

- visuell ansprechender
- sofort erkennbar
- moderne UI

---

# 11. Erweiterung: Popover / Teilnehmerliste

Zukünftige Optionen:

## Variante 1: Popover

Klick auf Teilnehmer → kleines Overlay

## Variante 2: eigene Seite

Route:

/events/:id/participants

---

## Vorteil

- skalierbar
- übersichtlich bei vielen Teilnehmern

---

# 12. Wichtige UX-Erkenntnisse

## 1. Daten ≠ gute Darstellung

Nur weil Daten vorhanden sind, heißt das nicht, dass sie gut dargestellt sind.

---

## 2. Mobile First ist entscheidend

Hover funktioniert nicht → Design muss angepasst werden.

---

## 3. Kompaktheit ist wichtig

Zu viele Informationen zerstören die Übersicht.

---

## 4. Konsistenz im UI

Teilnehmer werden jetzt gleich dargestellt in:

- Event-Liste
- Detailseite
- Profilseite

---

# 13. Technische Umsetzung

Backend:

- EventParticipantPreview Schema
- strukturierte Teilnehmerdaten

Frontend:

- Mapping zu kompakter Darstellung
- Nutzung von participants_preview
- Nutzung von participants

---

# 14. Aktueller Stand

Die Teilnehmerdarstellung bietet jetzt:

- kompakte Namensdarstellung
- Vorschau in Listen
- vollständige Darstellung in Detailseiten
- mobilefreundliche UX

---

# 15. Nächste Schritte

- Avatar-Komponenten
- Popover für Teilnehmer
- eigene Teilnehmerseite
- visuelle Verbesserung der Event-Cards

---

# Zusammenfassung

Die Teilnehmerdarstellung wurde von einer einfachen Username-Liste zu einer strukturierten, UX-optimierten Darstellung weiterentwickelt.

Wichtige Verbesserungen:

- echte Namen statt Usernames
- kompakte Darstellung (Max M.)
- Vorschau in Listen
- vollständige Anzeige in Detailseiten
- mobilefreundliche UX

Dies ist ein wichtiger Schritt, um die Anwendung näher an ein echtes Produkt zu bringen.
