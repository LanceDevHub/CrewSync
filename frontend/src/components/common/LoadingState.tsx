import { Box, Spinner, Stack, Text } from "@chakra-ui/react";

type LoadingStateProps = {
  message?: string;
};

export default function LoadingState({
  message = "Wird geladen...",
}: LoadingStateProps) {
  return (
    <Box
      bg="surface"
      p="6"
      borderRadius="xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="border"
    >
      <Stack gap="3" align="center">
        <Spinner color="brandAccent" size="lg" />
        <Text color="textMuted">{message}</Text>
      </Stack>
    </Box>
  );
}
