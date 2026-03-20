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

import { loginUser } from "../api/auth";
import type { User } from "../types/user";

type LoginPageProps = {
  onLoginSuccess: (user: User) => void;
};

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await loginUser({
        email,
        password,
      });

      onLoginSuccess(user);
      navigate("/events");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed.");
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
          <Heading size="lg">Login</Heading>
          <Text color="gray.600" mt="2">
            Melde dich an, um Events zu sehen und daran teilzunehmen.
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack gap="4">
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
                  <Alert.Title>Login fehlgeschlagen</Alert.Title>
                  <Alert.Description>{error}</Alert.Description>
                </Alert.Content>
              </Alert.Root>
            )}

            <Button type="submit" colorPalette="teal" loading={isLoading}>
              Login
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
