import { useState } from "react";
import {
  Alert,
  Box,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import { unlockSiteAccess } from "../api/siteAccess";
import AppButton from "../components/ui/AppButton";

type AccessGatePageProps = {
  onAccessGranted: () => void;
};

export default function AccessGatePage({
  onAccessGranted,
}: AccessGatePageProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await unlockSiteAccess(password);
      onAccessGranted();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Zugang konnte nicht freigeschaltet werden.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box
      maxW="md"
      mx="auto"
      mt="16"
      p="8"
      bg="surface"
      borderRadius="xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="border"
    >
      <Stack gap="6">
        <Box>
          <Heading size="lg" color="text">
            Zugang geschützt
          </Heading>
          <Text color="textMuted" mt="2">
            Bitte gib das Masterpasswort ein, um die Website zu betreten.
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack gap="4">
            <Field.Root required>
              <Field.Label color="text">Masterpasswort</Field.Label>
              <Input
                type="password"
                value={password}
                color="text"
                bg="surface"
                borderColor="border"
                _placeholder={{ color: "textMuted" }}
                _focusVisible={{ borderColor: "brandAccent" }}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Field.Root>

            {error && (
              <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Zugriff verweigert</Alert.Title>
                  <Alert.Description>{error}</Alert.Description>
                </Alert.Content>
              </Alert.Root>
            )}

            <AppButton type="submit" appVariant="primary" loading={isLoading}>
              Website entsperren
            </AppButton>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
