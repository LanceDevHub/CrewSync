# Frontend – Username & Passwort Änderung

## Überblick

In diesem Schritt wurde die Möglichkeit hinzugefügt, dass ein eingeloggter Benutzer:

- seinen **Benutzernamen ändern** kann
- sein **Passwort ändern** kann

Diese Funktionalität wurde vollständig in der **ProfilePage** umgesetzt.

---

## Architektur

Die Umsetzung basiert auf:

- React State Management (`useState`)
- Conditional Rendering (Formulare ein-/ausklappen)
- API Calls über `api/users.ts`
- Chakra UI Komponenten

---

## Neue API Funktionen

Datei: `frontend/src/api/users.ts`

```ts
import { patch } from "../lib/api-client";

export function updateMyUsername(username: string) {
  return patch("/users/me/username", { username });
}

export function changeMyPassword(currentPassword: string, newPassword: string) {
  return patch("/users/me/password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
}
```

---

## UI Erweiterungen (ProfilePage)

### Neue States

```ts
const [showUsernameForm, setShowUsernameForm] = useState(false);
const [showPasswordForm, setShowPasswordForm] = useState(false);

const [newUsername, setNewUsername] = useState("");
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmNewPassword, setConfirmNewPassword] = useState("");

const [accountError, setAccountError] = useState("");
const [accountSuccess, setAccountSuccess] = useState("");

const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
```

---

## UI Buttons

```tsx
<AppButton onClick={() => setShowUsernameForm(prev => !prev)}>
  Username ändern
</AppButton>

<AppButton onClick={() => setShowPasswordForm(prev => !prev)}>
  Passwort ändern
</AppButton>
```

---

## Username ändern

### Logik

```ts
async function handleUpdateUsername() {
  if (!newUsername.trim()) {
    setAccountError("Bitte gib einen Benutzernamen ein.");
    return;
  }

  const updatedUser = await updateMyUsername(newUsername);
  setCurrentUser(updatedUser);
}
```

### Verhalten

- Validierung nur beim Klick auf "Speichern"
- Kein Live-API Call während Eingabe
- UI wird nach Erfolg aktualisiert

---

## Passwort ändern

### Validierung im Frontend

```ts
const passwordsDoNotMatch = newPassword !== confirmNewPassword;
```

### Logik

```ts
async function handleChangePassword() {
  if (passwordsDoNotMatch) return;

  await changeMyPassword(currentPassword, newPassword);
}
```

---

## UX Verbesserungen

- Fehler & Erfolg werden angezeigt via `Alert`
- Formulare sind einklappbar (`Collapsible`)
- Buttons zeigen Loading-State
- Eingaben werden nach Erfolg zurückgesetzt

---

## Performance Fix

Problem:

- UI wirkte "laggy"

Lösung:

- API Calls **nur bei Submit**
- Keine Live-Validierung gegen Backend

---

## Sicherheit

Frontend:

- Passwortvergleich (`confirm password`) ist sicher
- dient nur UX

Backend:

- übernimmt echte Validierung
- überprüft aktuelles Passwort

---

## Ergebnis

Der Benutzer kann jetzt:

- Username ändern
- Passwort ändern
- Fehler sofort sehen
- Änderungen ohne Page Reload durchführen

---

## Fazit

Die Implementierung ist:

- performant
- sicher (Backend-validiert)
- UX-optimiert
- modular erweiterbar
