"use client";

import { useState } from "react";
import CreateTournamentModal from "./CreateTournamentModal";
import { useAiTelemetry } from "@/hooks/useAiTelemetry";

export default function TournamentHeaderActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { trackEvent } = useAiTelemetry();

  const handleOpenModal = () => {
    trackEvent({
      eventType: "click",
      category: "tournament_modal",
      metadata: { action: "open_create_modal" }
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <button 
        onClick={handleOpenModal}
        className="bg-purple-600/80 border border-purple-400 text-white font-bold py-3.5 px-8 rounded-full transition-all duration-300 hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105 text-lg"
      >
        Create Tournament
      </button>

      <CreateTournamentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          // In a real app we'd refresh the list, maybe via router.refresh()
          window.location.reload(); 
        }} 
      />
    </>
  );
}
