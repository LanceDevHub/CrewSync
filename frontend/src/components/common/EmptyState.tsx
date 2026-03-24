import { Box, Text } from "@chakra-ui/react";

type EmptyStateProps = {
  message: string;
};

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <Box
      bg="surface"
      p="6"
      borderRadius="xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="border"
      textAlign="center"
    >
      <Text fontSize="sm" color="textMuted">
        {message}
      </Text>
    </Box>
  );
}
