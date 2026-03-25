import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Field, Input, Stack, Text } from "@chakra-ui/react";

import { registerUser } from "../api/auth";
import AppButton from "../components/ui/AppButton";
import AuthFormCard from "../components/auth/AuthFormCard";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordsDoNotMatch = useMemo(() => {
    if (!password || !confirmPassword) {
      return false;
    }

    return password !== confirmPassword;
  }, [password, confirmPassword]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      setSuccessMessage(
        "Registrierung erfolgreich. Du kannst dich jetzt einloggen.",
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registrierung fehlgeschlagen.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthFormCard
      title="Register"
      description="Erstelle ein Konto, um eigene Events anzulegen und Events beizutreten."
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="4">
          <Field.Root required>
            <Field.Label color="text">Benutzername</Field.Label>
            <Input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              color="text"
              bg="surface"
              borderColor="border"
              _placeholder={{ color: "textMuted" }}
              _focusVisible={{ borderColor: "brandAccent" }}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label color="text">Vorname</Field.Label>
            <Input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              color="text"
              bg="surface"
              borderColor="border"
              _placeholder={{ color: "textMuted" }}
              _focusVisible={{ borderColor: "brandAccent" }}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label color="text">Nachname</Field.Label>
            <Input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              color="text"
              bg="surface"
              borderColor="border"
              _placeholder={{ color: "textMuted" }}
              _focusVisible={{ borderColor: "brandAccent" }}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label color="text">E-Mail</Field.Label>
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

          <Field.Root required>
            <Field.Label color="text">Passwort</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              color="text"
              bg="surface"
              borderColor="border"
              _placeholder={{ color: "textMuted" }}
              _focusVisible={{ borderColor: "brandAccent" }}
            />
          </Field.Root>

          <Field.Root invalid={passwordsDoNotMatch} required>
            <Field.Label color="text">Passwort wiederholen</Field.Label>
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
                <Alert.Title>Registrierung fehlgeschlagen</Alert.Title>
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
            Register
          </AppButton>
        </Stack>
      </form>
    </AuthFormCard>
  );
}
