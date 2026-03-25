import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import PageContainer from "../components/common/PageContainer";
import ProfileAccountCard from "../components/profile/ProfileAccountCard";
import ProfileEventsSection from "../components/profile/ProfileEventsSection";
import { useProfileData } from "../components/profile/useProfileData";

export default function ProfilePage() {
  const {
    currentUser,
    setCurrentUser,
    createdEvents,
    joinedEvents,
    isLoading,
    error,
  } = useProfileData();

  if (isLoading) return <LoadingState message="Profil wird geladen..." />;
  if (error) return <EmptyState message={error} />;
  if (!currentUser) return <EmptyState message="Nicht eingeloggt." />;

  return (
    <PageContainer
      title="Mein Profil"
      description="Hier findest du deine Profildaten sowie deine beigetretenen und erstellten Events."
    >
      <ProfileAccountCard
        currentUser={currentUser}
        onUserUpdate={setCurrentUser}
      />

      <ProfileEventsSection
        title="Beigetretene Events"
        events={joinedEvents}
        includeCreatorInSearch
        defaultOpen
      />

      <ProfileEventsSection title="Erstellte Events" events={createdEvents} />
    </PageContainer>
  );
}
