import {
  Badge,
  Box,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";

import type { User } from "../../types/user";
import logoDark from "../../assets/logo/default.svg";
import logoLight from "../../assets/logo/default_light.svg";

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
  fullWidth?: boolean;
};

function NavLinkButton({
  to,
  label,
  isActive,
  fullWidth = false,
}: NavLinkButtonProps) {
  return (
    <AppButton
      asChild
      appVariant={isActive ? "primary" : "secondary"}
      bg={isActive ? "mutedBg" : "transparent"}
      px={{ base: "2", sm: "3", md: "4" }}
      h={{ base: "32px", md: "36px" }}
      fontSize={{ base: "sm", md: "sm" }}
      flexShrink={0}
      width={fullWidth ? "full" : "auto"}
    >
      <RouterLink to={to}>{label}</RouterLink>
    </AppButton>
  );
}

export default function Navbar({ currentUser, onLogout }: NavbarProps) {
  const location = useLocation();
  const { resolvedTheme } = useTheme();

  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;

  const profileLabel = useBreakpointValue({
    base: "Bereich",
    md: "Mein Bereich",
  });

  const searchLabel = useBreakpointValue({
    base: "Suchen",
    md: "Event Suche",
  });

  const createLabel = useBreakpointValue({
    base: "Erstellen",
    md: "Event erstellen",
  });

  const userDisplayLabel = useBreakpointValue({
    base: currentUser?.username ?? "",
    md: `Eingeloggt als: ${currentUser?.username ?? ""}`,
  });

  const isDark = resolvedTheme !== "light";
  const logoSrc = isDark ? logoDark : logoLight;

  const logoStyle = isDark
    ? {
        filter: `
          drop-shadow(1px 0 0 black)
          drop-shadow(-1px 0 0 black)
          drop-shadow(0 1px 0 black)
          drop-shadow(0 -1px 0 black)
        `,
      }
    : undefined;

  return (
    <Box
      as="nav"
      bg="surface"
      borderBottomWidth="1px"
      borderColor="border"
      boxShadow="sm"
      px={{ base: "3", sm: "4", md: "6", lg: "8" }}
      py={{ base: "3", md: "4" }}
    >
      {isMobile ? (
        <Stack align="center" gap="2">
          <Box>
            <RouterLink to={currentUser ? "/events" : "/login"}>
              <Image
                src={logoSrc}
                alt="CrewSync Logo"
                h="25px"
                w="80px"
                objectFit="contain"
                style={logoStyle}
              />
            </RouterLink>
          </Box>

          {currentUser ? (
            <>
              <HStack gap="2" w="full">
                <Box flex="1">
                  <NavLinkButton
                    to="/me"
                    label={profileLabel ?? "Bereich"}
                    isActive={location.pathname === "/me"}
                    fullWidth
                  />
                </Box>

                <Box flex="1">
                  <NavLinkButton
                    to="/events"
                    label={searchLabel ?? "Suchen"}
                    isActive={location.pathname === "/events"}
                    fullWidth
                  />
                </Box>

                <Box flex="1">
                  <NavLinkButton
                    to="/events/new"
                    label={createLabel ?? "Erstellen"}
                    isActive={location.pathname === "/events/new"}
                    fullWidth
                  />
                </Box>
              </HStack>

              <Flex w="full" align="center" justify="space-between" gap="2">
                {/* LEFT: Username */}
                <HStack
                  paddingLeft="2"
                  gap="3"
                  align="center"
                  minW={0}
                  flex="1"
                  overflow="hidden"
                >
                  <Text
                    fontSize="sm"
                    color="textMuted"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {userDisplayLabel}
                  </Text>

                  {currentUser.is_admin && (
                    <Badge colorPalette="purple" variant="subtle">
                      Admin
                    </Badge>
                  )}
                </HStack>

                {/* RIGHT: Actions */}
                <HStack gap="4" flexShrink={0} paddingRight="2">
                  <ColorModeButton />

                  <AppButton
                    appVariant="danger"
                    onClick={onLogout}
                    px="3"
                    h="32px"
                    fontSize="sm"
                  >
                    Logout
                  </AppButton>
                </HStack>
              </Flex>
            </>
          ) : (
            <Flex w="full" align="center" justify="space-between" gap="2">
              <Box flex="1">
                <NavLinkButton
                  to="/login"
                  label="Login"
                  isActive={location.pathname === "/login"}
                  fullWidth
                />
              </Box>

              <Box flex="1">
                <AppButton
                  asChild
                  appVariant={
                    location.pathname === "/register" ? "primary" : "secondary"
                  }
                  bg={
                    location.pathname === "/register"
                      ? "mutedBg"
                      : "transparent"
                  }
                  px={{ base: "2", sm: "3", md: "4" }}
                  h={{ base: "32px", md: "36px" }}
                  fontSize={{ base: "sm", md: "sm" }}
                  width="full"
                >
                  <RouterLink to="/register">Register</RouterLink>
                </AppButton>
              </Box>

              <ColorModeButton />
            </Flex>
          )}
        </Stack>
      ) : (
        <Flex align="center" gap="4">
          <Box>
            <RouterLink to={currentUser ? "/events" : "/login"}>
              <Image
                src={logoSrc}
                alt="CrewSync Logo"
                h="25px"
                w="100px"
                objectFit="contain"
                style={logoStyle}
              />
            </RouterLink>
          </Box>

          <Box flex="1" />

          <HStack gap="3" align="center" flexWrap="nowrap">
            {currentUser ? (
              <>
                <NavLinkButton
                  to="/me"
                  label="Mein Bereich"
                  isActive={location.pathname === "/me"}
                />

                <NavLinkButton
                  to="/events"
                  label="Event Suche"
                  isActive={location.pathname === "/events"}
                />

                <NavLinkButton
                  to="/events/new"
                  label="Event erstellen"
                  isActive={location.pathname === "/events/new"}
                />

                <HStack gap="2" align="center">
                  <Text fontSize="sm" color="textMuted" whiteSpace="nowrap">
                    {userDisplayLabel}
                  </Text>

                  {currentUser.is_admin && (
                    <Badge colorPalette="purple" variant="subtle">
                      Admin
                    </Badge>
                  )}
                </HStack>

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
                  bg={
                    location.pathname === "/register"
                      ? "mutedBg"
                      : "transparent"
                  }
                  px={{ base: "2", sm: "3", md: "4" }}
                  h={{ base: "32px", md: "36px" }}
                  fontSize={{ base: "sm", md: "sm" }}
                >
                  <RouterLink to="/register">Register</RouterLink>
                </AppButton>

                <ColorModeButton />
              </>
            )}
          </HStack>
        </Flex>
      )}
    </Box>
  );
}
