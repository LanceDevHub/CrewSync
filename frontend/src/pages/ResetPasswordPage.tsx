import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Field, Input, Stack, Text } from "@chakra-ui/react";

import { resetPassword } from "../api/auth";
import AppButton from "../components/ui/AppButton";
import AuthFormCard from "../components/auth/AuthFormCard";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordsDoNotMatch = useMemo(() => {
    if (!newPassword || !confirmPassword) {
      return false;
    }

    return newPassword !== confirmPassword;
  }, [newPassword, confirmPassword]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!token) {
      setError("Kein Reset-Token gefunden.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(token, newPassword);
      setSuccessMessage(result.message);

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Passwort konnte nicht zurückgesetzt werden.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthFormCard
      title="Neues Passwort setzen"
      description="Gib dein neues Passwort ein."
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="4">
          <Field.Root required>
            <Field.Label>Neues Passwort</Field.Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              color="text"
              bg="surface"
              borderColor="border"
              _placeholder={{ color: "textMuted" }}
              _focusVisible={{ borderColor: "brandAccent" }}
            />
          </Field.Root>

          <Field.Root invalid={passwordsDoNotMatch} required>
            <Field.Label>Passwort wiederholen</Field.Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              color="text"
              bg="surface"
              borderColor={passwordsDoNotMatch ? "red.500" : "border"}
              _placeholder={{ color: "textMuted" }}
              _focusVisible={{
                borderColor: passwordsDoNotMatch ? "red.500" : "brandAccent",
              }}
            />

            {passwordsDoNotMatch && (
              <Text mt="2" fontSize="sm" color="red.500">
                Die Passwörter stimmen nicht überein.
              </Text>
            )}
          </Field.Root>

          {error && (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Fehler</Alert.Title>
                <Alert.Description>{error}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          {successMessage && (
            <Alert.Root status="success">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Erfolgreich</Alert.Title>
                <Alert.Description>{successMessage}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          <AppButton
            type="submit"
            appVariant="primary"
            loading={isLoading}
            disabled={passwordsDoNotMatch}
          >
            Passwort zurücksetzen
          </AppButton>
        </Stack>
      </form>
    </AuthFormCard>
  );
}
