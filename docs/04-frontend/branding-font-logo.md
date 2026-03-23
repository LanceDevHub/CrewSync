# Frontend Branding – Font & Logo Integration

Dieses Dokument beschreibt die Integration der globalen Schriftart sowie des Logos im Frontend.

Ziel war es, der Anwendung ein klares visuelles Branding zu geben und die Grundlage für ein konsistentes UI-Design zu schaffen.

---

# 1. Ziel dieses Abschnitts

- Einbindung einer eigenen Schriftart
- Integration eines Logos in die Navigation
- visuelle Vereinheitlichung des Frontends
- Vorbereitung für weiteres UI/UX Styling

---

# 2. Schriftart Integration

## Verwendete Schriftart

Es wurde die Schriftart **Raleway** verwendet.

Quelle:
https://fonts.google.com/specimen/Raleway

---

## 2.1 Einbindung im Projekt

Die Schrift wurde über Google Fonts eingebunden.

In der Datei:
index.html

wurden folgende Zeilen ergänzt:

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

---

## 2.2 Verwendung im Theme

Die Schrift wurde global im Theme gesetzt.

Beispiel:

fonts: {
heading: "'Raleway', sans-serif",
body: "'Raleway', sans-serif",
}

---

## Ergebnis

- Einheitliche Typografie im gesamten Frontend
- moderner und klarer Look
- bessere Lesbarkeit
- klareres Branding

---

# 3. Logo Integration

## Ziel

Das Logo wurde in die Hauptnavigation integriert, um:

- Wiedererkennungswert zu schaffen
- die Marke sichtbar zu machen
- die Navigation visuell aufzuwerten

---

## 3.1 Implementierung

Struktur:

- Logo
- Produktname
- Zusatzbeschreibung

Beispiel:

<Image
src={logo}
alt="CrewSync Logo"
h="36px"
w="36px"
objectFit="contain"
style={{
    filter: `
      drop-shadow(1px 0 0 black)
      drop-shadow(-1px 0 0 black)
      drop-shadow(0 1px 0 black)
      drop-shadow(0 -1px 0 black)
    `,
  }}
/>

---

## 3.2 Wichtige technische Entscheidung

Problem:
Box mit as="img" führte zu TypeScript-Fehlern bei src.

Lösung:
Verwendung der Chakra-Komponente Image.

Vorteile:

- korrekte Typisierung
- bessere Lesbarkeit
- weniger Fehleranfällig

---

# 4. Logo Outline (visuelle Hervorhebung)

## Problem

Ein normaler Border um die Box umrandet nur das Rechteck, nicht das Logo selbst.

---

## Lösung

Verwendung von CSS drop-shadow zur Outline-Erzeugung:

filter:
drop-shadow(1px 0 0 black)
drop-shadow(-1px 0 0 black)
drop-shadow(0 1px 0 black)
drop-shadow(0 -1px 0 black)

---

## Vorteil

- Outline folgt der tatsächlichen Form des Logos
- funktioniert bei transparentem Hintergrund
- wirkt deutlich natürlicher

---

# 5. Branding Text

Neben dem Logo:

CrewSync → Hauptname  
Events → Beschreibung

---

## Entscheidung

"Events" wurde gewählt, weil:

- klar
- kurz
- sofort verständlich

---

## Darstellung

CrewSync:

- bold
- größer
- in Brand-Farbe

Events:

- kleiner
- dezenter

---

# 6. Ergebnis

Nach diesem Schritt:

✔ eigene Schriftart integriert  
✔ Logo sichtbar eingebunden  
✔ Branding im Header vorhanden  
✔ visuell klarere Navigation  
✔ konsistentes Erscheinungsbild

---

# 7. Nächste Schritte

- Button-Farben anpassen
- Design-System definieren
- Dark Mode
- UI/UX Feinschliff

---

# Zusammenfassung

Durch Font + Logo Integration wirkt die Anwendung:

- professioneller
- konsistenter
- wiedererkennbarer

Dies bildet die Grundlage für alle weiteren Design-Verbesserungen.
