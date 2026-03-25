import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import AppButton from "../ui/AppButton";
import type { Event } from "../../types/event";
import type { User } from "../../types/user";

type Props = {
  event: Event;
  user: User | null;
  loading: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
};

export default function EventActions({
  event,
  user,
  loading,
  onJoin,
  onLeave,
  onEdit,
  onDelete,
  onShare,
}: Props) {
  const isCreator = user?.id === event.creator_id;
  const isAdmin = user?.is_admin;
  const canManage = isCreator || isAdmin;

  return (
    <Box
      bg="surface"
      p="8"
      borderRadius="2xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="border"
    >
      <Stack gap="4">
        <Heading size="md">Aktionen</Heading>

        {user ? (
          <Stack
            direction={{ base: "column", sm: "row" }}
            gap="3"
            flexWrap="wrap"
          >
            {/* JOIN */}
            {!event.is_joined && (
              <AppButton
                onClick={onJoin}
                appVariant="primary"
                loading={loading}
              >
                Event beitreten
              </AppButton>
            )}

            {/* LEAVE */}
            {event.is_joined && (
              <AppButton
                onClick={onLeave}
                appVariant="secondary"
                loading={loading}
              >
                Event verlassen
              </AppButton>
            )}

            {/* EDIT */}
            {canManage && (
              <AppButton
                onClick={onEdit}
                appVariant="secondary"
                disabled={loading}
              >
                Event bearbeiten
              </AppButton>
            )}

            {/* DELETE */}
            {canManage && (
              <AppButton
                onClick={onDelete}
                appVariant="danger"
                disabled={loading}
              >
                Event löschen
              </AppButton>
            )}

            {/* SHARE */}
            <AppButton appVariant="secondary" onClick={onShare}>
              Event teilen
            </AppButton>
          </Stack>
        ) : (
          <Text color="textMuted">
            Du musst eingeloggt sein, um mit diesem Event zu interagieren.
          </Text>
        )}

        {/* INFO TEXTS */}
        {isCreator && (
          <Text color="textMuted">Du bist der Ersteller dieses Events.</Text>
        )}

        {isAdmin && !isCreator && (
          <Text color="textMuted">
            Du bearbeitest dieses Event mit Admin-Rechten.
          </Text>
        )}
      </Stack>
    </Box>
  );
}
