import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

type PageContainerProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export default function PageContainer({
  title,
  description,
  children,
}: PageContainerProps) {
  return (
    <Stack gap="8">
      {(title || description) && (
        <Box>
          {title && (
            <Heading size="lg" color="text">
              {title}
            </Heading>
          )}
          {description && (
            <Text color="textMuted" mt="2">
              {description}
            </Text>
          )}
        </Box>
      )}

      {children}
    </Stack>
  );
}
