import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

type AuthFormCardProps = {
  title: string;
  description: string;
  maxW?: string;
  children: ReactNode;
};

export default function AuthFormCard({
  title,
  description,
  maxW = "md",
  children,
}: AuthFormCardProps) {
  return (
    <Box
      maxW={maxW}
      mx="auto"
      mt="10"
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
            {title}
          </Heading>
          <Text color="textMuted" mt="2">
            {description}
          </Text>
        </Box>

        {children}
      </Stack>
    </Box>
  );
}
