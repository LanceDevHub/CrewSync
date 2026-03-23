import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { getCurrentUser, logoutUser } from "./api/auth";
import { getSiteAccessStatus } from "./api/siteAccess";
import type { User } from "./types/user";

import AccessGatePage from "./pages/AccessGatePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import CreateEventPage from "./pages/CreateEventPage";
import ProfilePage from "./pages/ProfilePage";

import AppLayout from "./components/layout/AppLayout";

export default function App() {
  const [hasSiteAccess, setHasSiteAccess] = useState(false);
  const [siteAccessChecked, setSiteAccessChecked] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    async function checkSiteAccess() {
      try {
        const result = await getSiteAccessStatus();
        setHasSiteAccess(result.has_access);
      } catch {
        setHasSiteAccess(false);
      } finally {
        setSiteAccessChecked(true);
      }
    }

    checkSiteAccess();
  }, []);

  useEffect(() => {
    if (!hasSiteAccess) {
      setAuthChecked(false);
      setCurrentUser(null);
      return;
    }

    async function loadCurrentUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      } finally {
        setAuthChecked(true);
      }
    }

    loadCurrentUser();
  }, [hasSiteAccess]);

  async function handleLogout() {
    try {
      await logoutUser();
      setCurrentUser(null);
      setAuthError("");
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("Logout failed.");
      }
    }
  }

  if (!siteAccessChecked) {
    return <p>Loading...</p>;
  }

  if (!hasSiteAccess) {
    return <AccessGatePage onAccessGranted={() => setHasSiteAccess(true)} />;
  }

  if (!authChecked) {
    return <p>Loading...</p>;
  }

  return (
    <AppLayout currentUser={currentUser} onLogout={handleLogout}>
      {authError && <p style={{ color: "red" }}>{authError}</p>}

      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={setCurrentUser} />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/events/new" element={<CreateEventPage />} />
        <Route path="/me" element={<ProfilePage />} />
      </Routes>
    </AppLayout>
  );
}
