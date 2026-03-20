# Frontend Event-Funktionalität & Interaktionen

Dieses Dokument beschreibt die Erweiterung des Frontends um die zentrale Event-Funktionalität.

---

# 1. Ziel

- Events anzeigen
- Details anzeigen
- erstellen / bearbeiten / löschen
- join / leave
- Filter & Suche

Zusätzlich:

- Teilnehmeranzeige
- Join-Status
- Teilnehmer-Vorschau in Listen (neu)

---

# 2. Event-Typen

Neue Felder:

- `participants_count`
- `participants`
- `participants_preview`
- `is_joined`

---

# 3. Event-Liste (EventsPage)

## NEU: Teilnehmer-Vorschau

In der Liste wird jetzt angezeigt:

```text
anna, leo, mila
```

Wenn mehr Teilnehmer:

```text
anna, leo, mila, ...
```

---

## Umsetzung

```ts
event.participants_preview.join(", ");
```

- Bedingung:

```ts
if (participants_count > 3) → ", ..."
```

---

## Vorteil

- Nutzer sehen sofort Aktivität
- keine Detailseite nötig
- bessere UX

---

# 4. Event-Detailseite

## Teilnehmeranzeige

- vollständige Liste
- expand / collapse

---

## Join-Status

```ts
event.is_joined;
```

---

## Buttons

- Join
- Leave
- Edit / Delete (Creator)

---

# 5. Profilseite

## Erweiterung (neu)

Auch hier:

- Teilnehmer-Vorschau integriert
- gleiche Darstellung wie Event-Liste

---

## Vorteil

- konsistente UI
- gleiche Informationsdichte überall

---

# 6. Architekturentscheidung

## Liste vs Detail

| View        | Daten            |
| ----------- | ---------------- |
| Event-Liste | Preview (leicht) |
| Detailseite | Vollständig      |

---

# 7. Wichtige Erkenntnisse

## Backend bestimmt Logik

Frontend zeigt nur:

- Join-Status
- Teilnehmer

---

## Konsistenz ist entscheidend

Teilnehmer werden jetzt angezeigt in:

- Event-Liste
- Detailseite
- Profilseite

---

# 8. UX-Verbesserung

Die Teilnehmer-Vorschau sorgt dafür:

- Events wirken "lebendig"
- Nutzer sehen Aktivität sofort
- weniger Klicks notwendig

---

# 9. Was jetzt funktioniert

✔ Events anzeigen
✔ Details anzeigen
✔ Join / Leave
✔ Teilnehmer anzeigen
✔ Teilnehmer-Vorschau in Listen
✔ Profilseite erweitert
✔ Filter & Suche

---

# 10. Offene Verbesserungen

- bessere UI (Cards)
- Navigation verbessern
- AuthContext
- Pagination

---

# 11. Zusammenfassung

Das Frontend bietet jetzt:

- vollständige Event-Interaktion
- sichtbare Teilnehmerstruktur
- konsistente Darstellung über alle Seiten

Die Anwendung wirkt damit deutlich "echter" und näher an einem produktiven System.
