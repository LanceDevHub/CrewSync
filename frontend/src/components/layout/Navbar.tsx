import { Flex, Button, Spacer, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import type { User } from "../../types/user";

type NavbarProps = {
  currentUser: User | null;
  onLogout: () => void;
};

export default function Navbar({ currentUser, onLogout }: NavbarProps) {
  return (
    <Flex as="nav" bg="gray.800" color="white" padding="1rem" align="center">
      <Text fontWeight="bold">Music Events</Text>

      <Spacer />

      <Flex gap="1rem" align="center">
        {currentUser ? (
          <>
            <Button asChild colorPalette="teal" variant="ghost">
              <Link to="/events">Events</Link>
            </Button>

            <Button asChild colorPalette="teal" variant="ghost">
              <Link to="/events/new">Create Event</Link>
            </Button>

            <Button asChild colorPalette="teal" variant="ghost">
              <Link to="/me">Profile</Link>
            </Button>

            <Button onClick={onLogout} colorPalette="red">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button asChild colorPalette="teal">
              <Link to="/login">Login</Link>
            </Button>

            <Button asChild variant="outline" colorPalette="teal">
              <Link to="/register">Register</Link>
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
}
