import { Box, Heading, Spinner, Stack, Text } from "@chakra-ui/react";

export default function LoadingPage() {
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
        maxW="sm"
        w="full"
        textAlign="center"
      >
        <Stack gap="6" align="center">
          <Spinner size="xl" color="brandAccent" />

          <Heading size="md" color="brandAccent">
            Verbindung wird hergestellt...
          </Heading>

          <Text color="textMuted" fontSize="sm">
            Bitte einen Moment Geduld
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}
