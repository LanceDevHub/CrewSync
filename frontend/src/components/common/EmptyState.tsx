import { Box, Text } from "@chakra-ui/react";

type EmptyStateProps = {
  message: string;
};

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <Box bg="white" p="6" borderRadius="lg" boxShadow="sm">
      <Text>{message}</Text>
    </Box>
  );
}
