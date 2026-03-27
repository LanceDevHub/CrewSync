import { useEffect, useState } from "react";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";

export default function LoadingPage() {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="background"
      px="4"
    >
      <Box
        bg="surface"
        p="8"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="border"
        boxShadow="sm"
        maxW="md"
        w="full"
        textAlign="center"
      >
        <Stack gap="6">
          <Heading size="lg" color="brandAccent">
            Backend wird gestartet...
          </Heading>

          <Text color="text">
            Unsere Anwendung befindet sich aktuell in der <b>Vorentwicklung</b>.
          </Text>

          <Text color="textMuted">
            Aufgrund der kostenlosen Hosting-Umgebung wird das Backend nach
            Inaktivität automatisch gestoppt und muss beim ersten Zugriff neu
            gestartet werden.
          </Text>

          <Text color="textMuted">
            Dies kann bis zu <b>60 Sekunden</b> dauern.
          </Text>

          <Box
            bg="mutedBg"
            borderRadius="xl"
            borderWidth="1px"
            borderColor="border"
            py="6"
          >
            <Stack gap="2" align="center">
              <Text fontSize="sm" color="textMuted">
                Bitte warten...
              </Text>

              <Heading size="xl" color="brandAccent">
                {seconds}s
              </Heading>
            </Stack>
          </Box>

          <Text fontSize="xs" color="textMuted">
            Die Seite lädt automatisch, sobald das Backend verfügbar ist.
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}
