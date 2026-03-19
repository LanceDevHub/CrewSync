import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../api/auth";
import type { User } from "../types/user";

type LoginPageProps = {
  onLoginSuccess: (user: User) => void;
};

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await loginUser({
        email,
        password,
      });

      onLoginSuccess(user);
      navigate("/events");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-Mail</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="password">Passwort</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          style={{ marginTop: "1rem" }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
