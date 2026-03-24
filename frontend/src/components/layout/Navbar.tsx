import {
  Badge,
  Box,
  Flex,
  Image,
  Spacer,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";

import type { User } from "../../types/user";
import logo from "../../assets/logo/default.svg";

import AppButton from "../ui/AppButton";
import { ColorModeButton } from "../ui/color-mode";

type NavbarProps = {
  currentUser: User | null;
  onLogout: () => void;
};

type NavLinkButtonProps = {
  to: string;
  label: string;
  isActive: boolean;
};

function NavLinkButton({ to, label, isActive }: NavLinkButtonProps) {
  return (
    <AppButton
      asChild
      appVariant={isActive ? "primary" : "secondary"}
      bg={isActive ? "mutedBg" : "transparent"}
    >
      <RouterLink to={to}>{label}</RouterLink>
    </AppButton>
  );
}

export default function Navbar({ currentUser, onLogout }: NavbarProps) {
  const location = useLocation();

  const searchLabel = useBreakpointValue({
    base: "Suchen",
    md: "Event Suche",
  });

  const createLabel = useBreakpointValue({
    base: "Erstellen",
    md: "Event erstellen",
  });

  return (
    <Flex
      as="nav"
      bg="surface"
      borderBottomWidth="1px"
      borderColor="border"
      px="6"
      py="4"
      align="center"
      gap="4"
      wrap="wrap"
      boxShadow="sm"
    >
      <Box>
        <RouterLink to={currentUser ? "/events" : "/login"}>
          <Stack direction="row" gap="3" align="center">
            <Image
              src={logo}
              alt="CrewSync Logo"
              h="25px"
              w="100px"
              objectFit="contain"
              style={{
                filter: `
                  drop-shadow(1px 0 0 black)
                  drop-shadow(-1px 0 0 black)
                  drop-shadow(0 1px 0 black)
                  drop-shadow(0 -1px 0 black)
                `,
              }}
            />
            <Text
              fontWeight="bold"
              fontSize="lg"
              color="brandAccent"
              style={{
                filter: `
                  drop-shadow(1px 0 0 black)
                  drop-shadow(-1px 0 0 black)
                  drop-shadow(0 1px 0 black)
                  drop-shadow(0 -1px 0 black)
                `,
              }}
            >
              Events
            </Text>
          </Stack>
        </RouterLink>
      </Box>

      <Spacer />

      <Stack direction="row" gap="3" align="center" flexWrap="wrap">
        {currentUser ? (
          <>
            <NavLinkButton
              to="/me"
              label="Mein Bereich"
              isActive={location.pathname === "/me"}
            />

            <NavLinkButton
              to="/events"
              label={searchLabel ?? "Event Suche"}
              isActive={location.pathname === "/events"}
            />

            <NavLinkButton
              to="/events/new"
              label={createLabel ?? "Event erstellen"}
              isActive={location.pathname === "/events/new"}
            />

            <Stack direction="row" gap="2" align="center">
              <Text fontSize="sm" color="textMuted">
                Eingeloggt als: <strong>{currentUser.username}</strong>
              </Text>

              {currentUser.is_admin && (
                <Badge colorPalette="purple" variant="subtle">
                  Admin
                </Badge>
              )}
            </Stack>

            <ColorModeButton />

            <AppButton appVariant="danger" onClick={onLogout}>
              Logout
            </AppButton>
          </>
        ) : (
          <>
            <NavLinkButton
              to="/login"
              label="Login"
              isActive={location.pathname === "/login"}
            />

            <AppButton
              asChild
              appVariant={
                location.pathname === "/register" ? "primary" : "secondary"
              }
              bg={location.pathname === "/register" ? "mutedBg" : "transparent"}
            >
              <RouterLink to="/register">Register</RouterLink>
            </AppButton>

            <ColorModeButton />
          </>
        )}
      </Stack>
    </Flex>
  );
}
