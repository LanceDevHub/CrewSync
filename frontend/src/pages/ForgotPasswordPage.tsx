import { useState } from "react";
import { Alert, Field, Input, Stack } from "@chakra-ui/react";

import { forgotPassword } from "../api/auth";
import AppButton from "../components/ui/AppButton";
import AuthFormCard from "../components/auth/AuthFormCard";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const result = await forgotPassword(email);
      setSuccessMessage(result.message);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Reset konnte nicht angefordert werden.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthFormCard
      title="Passwort vergessen"
      description="Gib deine E-Mail ein. Falls ein Konto existiert, wird ein Reset-Link erstellt."
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="4">
          <Field.Root required>
            <Field.Label>E-Mail</Field.Label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              color="text"
              bg="surface"
              borderColor="border"
              _placeholder={{ color: "textMuted" }}
              _focusVisible={{ borderColor: "brandAccent" }}
            />
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

          <AppButton type="submit" appVariant="primary" loading={isLoading}>
            Reset-Link anfordern
          </AppButton>
        </Stack>
      </form>
    </AuthFormCard>
  );
}
