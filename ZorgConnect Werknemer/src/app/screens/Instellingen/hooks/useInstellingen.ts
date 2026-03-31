import { useState } from "react";
import { useNavigate } from "react-router";
import { mockLinkedClientsDetailed, mockUnlinkedClients } from "../../../data/mockData";

export function useInstellingen() {
  const navigate = useNavigate();
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [status, setStatus] = useState<"beschikbaar" | "achterwacht" | "niet-beschikbaar">(
    "beschikbaar"
  );
  const [receiveEmergencyCalls, setReceiveEmergencyCalls] = useState(true);
  const [showSOSAlert, setShowSOSAlert] = useState(false);
  const [linkedClients, setLinkedClients] = useState(mockLinkedClientsDetailed);
  const [showLinkSheet, setShowLinkSheet] = useState(false);
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const maxClients = 10;
  const linkedClientsCount = linkedClients.length;
  const isAtCapacity = linkedClientsCount >= maxClients;
  const isNearCapacity = linkedClientsCount >= 9;

  const filteredUnlinkedClients = mockUnlinkedClients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnlinkClient = (clientId: number) => {
    setLinkedClients(linkedClients.filter((c) => c.id !== clientId));
    setShowUnlinkConfirm(null);
  };

  const handleLinkClient = (newClient: typeof mockUnlinkedClients[0]) => {
    if (!isAtCapacity) {
      setLinkedClients([
        ...linkedClients,
        {
          ...newClient,
          lastContact: "Nooit",
          hasActiveSOS: false,
        },
      ]);
      setShowLinkSheet(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const openLinkSheet = () => !isAtCapacity && setShowLinkSheet(true);
  const closeLinkSheet = () => setShowLinkSheet(false);

  return {
    isOnDuty,
    setIsOnDuty,
    status,
    setStatus,
    receiveEmergencyCalls,
    setReceiveEmergencyCalls,
    showSOSAlert,
    setShowSOSAlert,
    linkedClients,
    showLinkSheet,
    openLinkSheet,
    closeLinkSheet,
    showUnlinkConfirm,
    setShowUnlinkConfirm,
    searchQuery,
    setSearchQuery,
    maxClients,
    linkedClientsCount,
    isAtCapacity,
    isNearCapacity,
    filteredUnlinkedClients,
    handleUnlinkClient,
    handleLinkClient,
    handleLogout,
  };
}
