import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Field, Input, Stack } from "@chakra-ui/react";

import { loginUser } from "../api/auth";
import type { User } from "../types/user";
import AppButton from "../components/ui/AppButton";
import AuthFormCard from "../components/auth/AuthFormCard";

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
      const user = await loginUser({ email, password });
      onLoginSuccess(user);
      navigate("/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login fehlgeschlagen.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthFormCard
      title="Login"
      description="Melde dich an, um Events zu sehen und daran teilzunehmen."
    >
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

          <AppButton type="submit" appVariant="primary" loading={isLoading}>
            Login
          </AppButton>
        </Stack>
      </form>
    </AuthFormCard>
  );
}
