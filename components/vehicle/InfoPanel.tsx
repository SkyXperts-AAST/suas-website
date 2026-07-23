"use client";

import { subsystemLabel } from "@/lib/vehicle/subsystemLookup";
import type { GroupId } from "@/lib/vehicle/groupId";

interface InfoPanelProps {
  selectedGroup: GroupId | null;
  onClose: () => void;
}

export default function InfoPanel({ selectedGroup, onClose }: InfoPanelProps) {
  return (
    <div
      className={`absolute top-0 right-0 z-20 h-full w-full max-w-sm transform bg-[#141A5C]/95 p-6 text-[#F5F5F7] shadow-2xl backdrop-blur transition-transform duration-300 ease-out ${
        selectedGroup ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {selectedGroup && (
        <>
          <button
            onClick={onClose}
            className="mb-4 text-sm text-[#F5F5F7]/70 transition-colors hover:text-white"
          >
            Close ✕
          </button>
          <h2 className="text-2xl font-semibold text-[#E31C1C]">
            {subsystemLabel(selectedGroup.subsystem)}
          </h2>
          {selectedGroup.armIndex !== undefined && (
            <p className="mt-1 text-[#F5F5F7]/80">Arm {selectedGroup.armIndex + 1}</p>
          )}
          <p className="mt-4 text-[#4A4E6E]">Content coming soon.</p>
        </>
      )}
    </div>
  );
}
