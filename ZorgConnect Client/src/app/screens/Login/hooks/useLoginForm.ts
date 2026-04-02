import { useState } from "react";
import { useNavigate } from "react-router";

const AUTH_STORAGE_KEY = "zorgconnect:client:isAuthed";

export function useLoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
      } catch {
        // ignore (private browsing / storage disabled)
      }
      navigate("/home");
    }
  };

  return { email, setEmail, password, setPassword, handleLogin };
}
