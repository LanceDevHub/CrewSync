import { Box, Container } from "@chakra-ui/react";
import type { ReactNode } from "react";

import Navbar from "./Navbar";
import ScrollToTopButton from "../ui/ScrollToTopButton";
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
    <Box minH="100vh" bg="bg" color="text">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      <Container maxW="container.lg" py={{ base: "6", md: "8" }}>
        {children}
      </Container>

      <ScrollToTopButton />
    </Box>
  );
}
