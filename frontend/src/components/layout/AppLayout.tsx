import { Box, Container } from "@chakra-ui/react";
import type { ReactNode } from "react";

import Navbar from "./Navbar";
import type { User } from "../../types/user";

type AppLayoutProps = {
  children: ReactNode;
  currentUser: User | null;
  onLogout: () => void;
};

export default function AppLayout({
  children,
  currentUser,
  onLogout,
}: AppLayoutProps) {
  return (
    <Box minHeight="100vh" bg="gray.50">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      <Container maxW="container.lg" py="2rem">
        {children}
      </Container>
    </Box>
  );
}
