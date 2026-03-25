import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Stack } from "@chakra-ui/react";

import { toaster } from "../components/ui/toaster";

import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";

import EventDetailHeader from "../components/eventDetail/EventDetailHeader";
import EventParticipants from "../components/eventDetail/EventParticipants";
import EventActions from "../components/eventDetail/EventActions";
import EventEditForm from "../components/eventDetail/EventEditForm";
import { useEventDetail } from "../components/eventDetail/useEventDetail";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const {
    event,
    currentUser,
    isLoading,
    actionLoading,
    error,
    handleJoin,
    handleLeave,
    handleDelete,
    handleUpdate,
  } = useEventDetail(id);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);

      toaster.dismiss("copy-link");
      toaster.create({
        id: "copy-link",
        title: "Link kopiert",
        description: "Event-Link wurde in die Zwischenablage kopiert.",
        type: "success",
        closable: true,
      });
    } catch {
      toaster.dismiss("copy-link-error");
      toaster.create({
        id: "copy-link-error",
        title: "Fehler",
        description: "Link konnte nicht kopiert werden.",
        type: "error",
        closable: true,
      });
    }
  }

  async function handleSaveEdit(data: {
    title: string;
    lineup: string;
    official_link: string | null;
    location: string;
    start_datetime: string;
    end_datetime: string | null;
  }) {
    await handleUpdate(data);
    setIsEditing(false);
  }

  if (isLoading) return <LoadingState message="Event wird geladen..." />;
  if (!event) return <EmptyState message={error || "Nicht gefunden"} />;

  return (
    <Stack gap="6">
      {isEditing ? (
        <EventEditForm
          event={event}
          loading={actionLoading}
          onCancel={() => setIsEditing(false)}
          onSave={handleSaveEdit}
        />
      ) : (
        <>
          <EventDetailHeader event={event} />

          <EventParticipants event={event} />

          <EventActions
            event={event}
            user={currentUser}
            loading={actionLoading}
            onJoin={handleJoin}
            onLeave={handleLeave}
            onEdit={() => setIsEditing(true)}
            onDelete={() => handleDelete(navigate)}
            onShare={handleShare}
          />
        </>
      )}
    </Stack>
  );
}
