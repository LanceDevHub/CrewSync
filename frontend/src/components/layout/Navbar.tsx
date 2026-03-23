import {
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import type { User } from "../../types/user";
import logo from "../../assets/logo/default.svg";

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
    <Button
      asChild
      variant={isActive ? "solid" : "ghost"}
      colorPalette="teal"
      size="sm"
    >
      <RouterLink to={to}>{label}</RouterLink>
    </Button>
  );
}

export default function Navbar({ currentUser, onLogout }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const showBackButton =
    location.pathname !== "/events" && location.pathname !== "/login";

  return (
    <Flex
      as="nav"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      px="6"
      py="4"
      align="center"
      gap="4"
      wrap="wrap"
      boxShadow="sm"
    >
      {showBackButton && (
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          ← Zurück
        </Button>
      )}

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
              color="brand.500"
              objectFit="contain"
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
              to="/events"
              label="Event Suche"
              isActive={location.pathname === "/events"}
            />

            <NavLinkButton
              to="/events/new"
              label="Event erstellen"
              isActive={location.pathname === "/events/new"}
            />

            <NavLinkButton
              to="/me"
              label="Mein Bereich"
              isActive={location.pathname === "/me"}
            />

            <Stack direction="row" gap="2" align="center">
              <Text fontSize="sm" color="gray.600">
                Eingeloggt als: <strong>{currentUser.username}</strong>
              </Text>

              {currentUser.is_admin && (
                <Badge colorPalette="purple" variant="subtle">
                  Admin
                </Badge>
              )}
            </Stack>

            <Button onClick={onLogout} colorPalette="red" size="sm">
              Logout
            </Button>
          </>
        ) : (
          <>
            <NavLinkButton
              to="/login"
              label="Login"
              isActive={location.pathname === "/login"}
            />

            <Button
              asChild
              variant={location.pathname === "/register" ? "solid" : "outline"}
              colorPalette="teal"
              size="sm"
            >
              <RouterLink to="/register">Register</RouterLink>
            </Button>
          </>
        )}
      </Stack>
    </Flex>
  );
}
