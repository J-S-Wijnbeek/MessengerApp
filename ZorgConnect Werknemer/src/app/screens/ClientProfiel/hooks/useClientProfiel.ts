import { useParams, useNavigate } from "react-router";
import { mockLinkedClientsDetailed } from "../../../data/mockData";

export function useClientProfiel() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const client = mockLinkedClientsDetailed.find(
    (c) => c.id === Number(clientId)
  );

  const goBack = () => navigate(-1);
  const navigateToChat = (id: number) => navigate(`/chat/${id}`);

  return { client, goBack, navigateToChat };
}
