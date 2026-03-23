# Frontend Event-Funktionalität & Interaktionen

Dieses Dokument beschreibt die Event-Funktionalität im Frontend.

---

# 1. Ziel

- Events anzeigen
- Details anzeigen
- erstellen / bearbeiten / löschen
- join / leave
- Teilnehmer sichtbar machen

---

# 2. Event-Typen

Neue Felder aus dem Backend:

- participants_count
- participants
- participants_preview
- is_joined

## Teilnehmerstruktur (NEU)

Teilnehmer bestehen jetzt aus:

- username
- first_name
- last_name

---

# 3. Event-Liste (EventsPage)

## Teilnehmer-Vorschau

Anzeige:

anna s., leo m., mila k.

Wenn mehr Teilnehmer:

anna s., leo m., mila k., ...

---

## Darstellung

Format:

first_name + erster Buchstabe von last_name

---

## Vorteil

- kompakt
- gut lesbar
- mobile friendly

---

# 4. Event-Detailseite

## Teilnehmerliste

- vollständige Liste
- expand / collapse

---

## Anzeige

Jeder Teilnehmer:

- Vorname + Nachname
- Username zusätzlich sichtbar

---

## Join-Status

event.is_joined

→ steuert Join / Leave Button

---

# 5. Teilnehmer UX (NEU)

## Problem vorher

- nur Username sichtbar
- Hover notwendig → schlecht für Mobile

## Lösung

- Anzeige: "Max M."
- Details direkt sichtbar oder über Klick
- kein Hover nötig

---

# 6. Profilseite

## Erweiterung

- Teilnehmer-Vorschau integriert
- gleiche Darstellung wie Events

---

# 7. Architekturentscheidung

Liste vs Detail:

Event-Liste → leichte Daten (Preview)  
Detailseite → vollständige Daten

---

# 8. URL-Feld Fix (NEU)

## Problem

Frontend verlangte zwingend https://

## Lösung

Input akzeptiert jetzt auch:

www.example.com

Backend ergänzt automatisch:

https://

---

# 9. Backend-Abhängigkeit

Frontend nutzt:

- participants_preview
- participants
- is_joined

Backend liefert strukturierte Daten.

---

# 10. UX-Verbesserungen

- Teilnehmer sichtbar ohne Klick
- kompakte Darstellung
- konsistente Anzeige in allen Views

---

# 11. Was jetzt funktioniert

- Event-Liste
- Event-Details
- Join / Leave
- Teilnehmeranzeige
- Teilnehmer-Vorschau
- Profilseite mit Events
- URL-Fix
- mobile-friendly Darstellung

---

# 12. Nächste Schritte

- Avatar-Komponenten
- bessere Event-Cards
- Pagination
- globale State-Lösung

---

# Zusammenfassung

Das Frontend bietet jetzt:

- vollständige Event-Interaktion
- strukturierte Teilnehmerdaten
- konsistente Darstellung
- deutlich bessere UX

Die Anwendung wirkt dadurch deutlich näher an einem echten Produkt.
