import { useNavigate } from "react-router";

export function useClientProfiel() {
  const navigate = useNavigate();

  const goBack = () => navigate("/instellingen");

  return { goBack };
}
