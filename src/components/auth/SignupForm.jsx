// src/components/auth/SignupForm.jsx
import { useState } from "react";

const SignupForm = ({ onSubmit, loading }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    onSubmit({ name, email, password });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create account</h2>

      <label>
        Name
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label>
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label>
        Password
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <label>
        Confirm password
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </label>

      {localError && <p className="error">{localError}</p>}

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign up"}
      </button>
    </form>
  );
};

export default SignupForm;
