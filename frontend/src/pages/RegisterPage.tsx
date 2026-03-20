import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import { registerUser } from "../api/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      await registerUser({
        username,
        email,
        password,
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
    <Box
      maxW="md"
      mx="auto"
      mt="10"
      p="8"
      bg="white"
      borderRadius="lg"
      boxShadow="md"
    >
      <Stack gap="6">
        <Box>
          <Heading size="lg">Register</Heading>
          <Text color="gray.600" mt="2">
            Erstelle ein Konto, um eigene Events anzulegen und Events
            beizutreten.
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack gap="4">
            <Field.Root required>
              <Field.Label>Benutzername</Field.Label>
              <Input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>E-Mail</Field.Label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Passwort</Field.Label>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
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

            <Button type="submit" colorPalette="teal" loading={isLoading}>
              Register
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
