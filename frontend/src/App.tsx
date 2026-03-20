import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import { getCurrentUser, logoutUser } from "./api/auth";
import type { User } from "./types/user";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import CreateEventPage from "./pages/CreateEventPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
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
  }, []);

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

  if (!authChecked) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/events">Events</Link>
        <Link to="/events/new">Create Event</Link>
        <Link to="/me">Profile</Link>
      </nav>

      <div style={{ marginBottom: "1rem" }}>
        {currentUser ? (
          <>
            <p>Eingeloggt als: {currentUser.username}</p>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <p>Nicht eingeloggt</p>
        )}
      </div>

      {authError && <p style={{ color: "red" }}>{authError}</p>}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
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
    </div>
  );
}
