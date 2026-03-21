import { Box, Spinner, Stack, Text } from "@chakra-ui/react";

type LoadingStateProps = {
  message?: string;
};

export default function LoadingState({
  message = "Wird geladen...",
}: LoadingStateProps) {
  return (
    <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
      <Stack gap="3" align="center">
        <Spinner color="teal.500" />
        <Text>{message}</Text>
      </Stack>
    </Box>
  );
}
