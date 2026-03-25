import { useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Collapsible,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import { changeMyPassword, updateMyUsername } from "../../api/users";
import AppButton from "../ui/AppButton";
import type { User } from "../../types/user";

type ProfileAccountCardProps = {
  currentUser: User;
  onUserUpdate: (user: User) => void;
};

export default function ProfileAccountCard({
  currentUser,
  onUserUpdate,
}: ProfileAccountCardProps) {
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [newUsername, setNewUsername] = useState(currentUser.username);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [accountError, setAccountError] = useState("");
  const [accountSuccess, setAccountSuccess] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  async function handleUpdateUsername() {
    setAccountError("");
    setAccountSuccess("");

    if (!newUsername.trim()) {
      setAccountError("Bitte gib einen Benutzernamen ein.");
      return;
    }

    if (newUsername.trim() === currentUser.username) {
      setAccountError("Der neue Benutzername ist identisch mit dem aktuellen.");
      return;
    }

    setIsUpdatingUsername(true);

    try {
      const updatedUser = await updateMyUsername(newUsername.trim());
      onUserUpdate(updatedUser);
      setNewUsername(updatedUser.username);
      setAccountSuccess("Benutzername erfolgreich geändert.");
      setShowUsernameForm(false);
    } catch (err) {
      if (err instanceof Error) {
        setAccountError(err.message);
      } else {
        setAccountError("Benutzername konnte nicht geändert werden.");
      }
    } finally {
      setIsUpdatingUsername(false);
    }
  }

  async function handleChangePassword() {
    setAccountError("");
    setAccountSuccess("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setAccountError("Bitte fülle alle Passwortfelder aus.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setAccountError("Die neuen Passwörter stimmen nicht überein.");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const result = await changeMyPassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setAccountSuccess(result.message || "Passwort erfolgreich geändert.");
      setShowPasswordForm(false);
    } catch (err) {
      if (err instanceof Error) {
        setAccountError(err.message);
      } else {
        setAccountError("Passwort konnte nicht geändert werden.");
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  return (
    <Box
      bg="surface"
      p="6"
      borderRadius="xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="border"
    >
      <Stack gap="5">
        <Stack direction={{ base: "column", md: "row" }} gap="5">
          <Avatar.Root size="2xl">
            <Avatar.Fallback
              name={`${currentUser.first_name} ${currentUser.last_name}`}
            />
          </Avatar.Root>

          <Stack gap="2">
            <Stack direction="row" align="center" gap="2">
              <Heading size="lg">
                {currentUser.first_name} {currentUser.last_name}
              </Heading>

              {currentUser.is_admin && (
                <Badge colorPalette="purple" variant="subtle">
                  Admin
                </Badge>
              )}
            </Stack>

            <Text color="textMuted">@{currentUser.username}</Text>
            <Text color="textMuted">{currentUser.email}</Text>
          </Stack>
        </Stack>

        <Stack direction={{ base: "column", sm: "row" }} gap="3">
          <AppButton
            appVariant="secondary"
            onClick={() => {
              setShowUsernameForm((prev) => !prev);
              setShowPasswordForm(false);
              setAccountError("");
              setAccountSuccess("");
            }}
          >
            Username ändern
          </AppButton>

          <AppButton
            appVariant="secondary"
            onClick={() => {
              setShowPasswordForm((prev) => !prev);
              setShowUsernameForm(false);
              setAccountError("");
              setAccountSuccess("");
            }}
          >
            Passwort ändern
          </AppButton>
        </Stack>

        {accountError && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Fehler</Alert.Title>
              <Alert.Description>{accountError}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        {accountSuccess && (
          <Alert.Root status="success">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Erfolg</Alert.Title>
              <Alert.Description>{accountSuccess}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        <Collapsible.Root open={showUsernameForm}>
          <Collapsible.Content>
            <Stack gap="4">
              <Field.Root maxW="md">
                <Field.Label>Neuer Benutzername</Field.Label>
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  color="text"
                  bg="surface"
                  borderColor="border"
                  _placeholder={{ color: "textMuted" }}
                  _focusVisible={{ borderColor: "brandAccent" }}
                />
              </Field.Root>

              <Stack direction={{ base: "column", sm: "row" }} gap="3">
                <AppButton
                  appVariant="primary"
                  onClick={handleUpdateUsername}
                  loading={isUpdatingUsername}
                >
                  Username speichern
                </AppButton>

                <AppButton
                  appVariant="secondary"
                  onClick={() => {
                    setShowUsernameForm(false);
                    setNewUsername(currentUser.username);
                    setAccountError("");
                    setAccountSuccess("");
                  }}
                >
                  Abbrechen
                </AppButton>
              </Stack>
            </Stack>
          </Collapsible.Content>
        </Collapsible.Root>

        <Collapsible.Root open={showPasswordForm}>
          <Collapsible.Content>
            <Stack gap="4">
              <Field.Root maxW="md">
                <Field.Label>Aktuelles Passwort</Field.Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  color="text"
                  bg="surface"
                  borderColor="border"
                  _placeholder={{ color: "textMuted" }}
                  _focusVisible={{ borderColor: "brandAccent" }}
                />
              </Field.Root>

              <Field.Root maxW="md">
                <Field.Label>Neues Passwort</Field.Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  color="text"
                  bg="surface"
                  borderColor="border"
                  _placeholder={{ color: "textMuted" }}
                  _focusVisible={{ borderColor: "brandAccent" }}
                />
              </Field.Root>

              <Field.Root maxW="md">
                <Field.Label>Neues Passwort wiederholen</Field.Label>
                <Input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  color="text"
                  bg="surface"
                  borderColor="border"
                  _placeholder={{ color: "textMuted" }}
                  _focusVisible={{ borderColor: "brandAccent" }}
                />
              </Field.Root>

              <Stack direction={{ base: "column", sm: "row" }} gap="3">
                <AppButton
                  appVariant="primary"
                  onClick={handleChangePassword}
                  loading={isUpdatingPassword}
                >
                  Passwort speichern
                </AppButton>

                <AppButton
                  appVariant="secondary"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                    setAccountError("");
                    setAccountSuccess("");
                  }}
                >
                  Abbrechen
                </AppButton>
              </Stack>
            </Stack>
          </Collapsible.Content>
        </Collapsible.Root>
      </Stack>
    </Box>
  );
}
