import { useState } from "react";
import { useNavigate } from "react-router";

export function useLoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/staff-home");
  };

  return { email, setEmail, password, setPassword, handleLogin };
}
