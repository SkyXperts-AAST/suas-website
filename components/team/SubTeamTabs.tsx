"use client";

import { useId, useState } from "react";
import GroupPhotoRoster from "@/components/team/GroupPhotoRoster";
import {
  softwareGroups,
  subteams,
  SUB_TEAM_TABS,
  type SubTeamTab,
} from "@/lib/team/members";

export default function SubTeamTabs() {
  const [activeTab, setActiveTab] = useState<SubTeamTab>("Software");
  const baseId = useId();

  return (
    <div>
      <div
        role="tablist"
        aria-label="Sub-teams"
        className="flex flex-wrap gap-2 border-b border-white/10 pb-4"
      >
        {SUB_TEAM_TABS.map((tab) => {
          const selected = activeTab === tab;
          const tabId = `${baseId}-tab-${tab}`;
          const panelId = `${baseId}-panel-${tab}`;

          return (
            <button
              key={tab}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(event) => {
                const index = SUB_TEAM_TABS.indexOf(tab);
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  const next =
                    SUB_TEAM_TABS[(index + 1) % SUB_TEAM_TABS.length];
                  setActiveTab(next);
                  document.getElementById(`${baseId}-tab-${next}`)?.focus();
                }
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  const prev =
                    SUB_TEAM_TABS[
                      (index - 1 + SUB_TEAM_TABS.length) % SUB_TEAM_TABS.length
                    ];
                  setActiveTab(prev);
                  document.getElementById(`${baseId}-tab-${prev}`)?.focus();
                }
                if (event.key === "Home") {
                  event.preventDefault();
                  setActiveTab(SUB_TEAM_TABS[0]);
                  document
                    .getElementById(`${baseId}-tab-${SUB_TEAM_TABS[0]}`)
                    ?.focus();
                }
                if (event.key === "End") {
                  event.preventDefault();
                  const last = SUB_TEAM_TABS[SUB_TEAM_TABS.length - 1];
                  setActiveTab(last);
                  document.getElementById(`${baseId}-tab-${last}`)?.focus();
                }
              }}
              className={`rounded-full px-5 py-2.5 text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy ${
                selected
                  ? "border border-accent/40 bg-accent/15 text-accent"
                  : "border border-white/10 bg-white/[0.03] text-offwhite/70 hover:border-white/20 hover:bg-white/[0.06] hover:text-offwhite"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {SUB_TEAM_TABS.map((tab) => {
        const selected = activeTab === tab;
        const tabId = `${baseId}-tab-${tab}`;
        const panelId = `${baseId}-panel-${tab}`;

        return (
          <div
            key={tab}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!selected}
            className="pt-8"
          >
            {tab === "Software" ? (
              <div className="space-y-12">
                <p className="max-w-2xl text-base leading-8 text-offwhite/70 md:text-lg md:leading-8">
                  {softwareGroups.blurb}
                </p>
                <GroupPhotoRoster
                  title="Computer Vision"
                  blurb={softwareGroups.computerVision.blurb}
                  members={softwareGroups.computerVision.members}
                  groupPhoto={softwareGroups.computerVision.groupPhoto}
                  photoAlt="Computer Vision sub-team group photo"
                />
                <GroupPhotoRoster
                  title="Control & Navigation"
                  blurb={softwareGroups.controlAndNavigation.blurb}
                  members={softwareGroups.controlAndNavigation.members}
                  groupPhoto={softwareGroups.controlAndNavigation.groupPhoto}
                  photoAlt="Control & Navigation sub-team group photo"
                />
              </div>
            ) : tab === "Mechanical" ? (
              <GroupPhotoRoster
                members={subteams.Mechanical.members}
                groupPhoto={subteams.Mechanical.groupPhoto}
                blurb={subteams.Mechanical.blurb}
                photoAlt="Mechanical sub-team group photo"
              />
            ) : (
              <GroupPhotoRoster
                members={subteams.Electrical.members}
                groupPhoto={subteams.Electrical.groupPhoto}
                blurb={subteams.Electrical.blurb}
                photoAlt="Electrical sub-team group photo"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
