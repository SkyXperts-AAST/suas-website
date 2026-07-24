"use client";

import Image from "next/image";
import { useId, useState } from "react";
import MemberCard from "@/components/team/MemberCard";
import {
  softwareGroups,
  subteams,
  SUB_TEAM_TABS,
  type SubTeamTab,
  type TeamMember,
} from "@/lib/team/members";

function MemberGrid({ members }: { members: TeamMember[] }) {
  return (
    <ul className="mt-6 grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <li key={member.name} className="w-full max-w-[280px]">
          <MemberCard member={member} />
        </li>
      ))}
    </ul>
  );
}

function GroupPhotoRoster({
  members,
  groupPhoto,
  blurb,
}: {
  members: TeamMember[];
  groupPhoto?: string;
  blurb: string;
}) {
  const caption = `Picture left to right: ${members.map((m) => m.name).join(", ")}.`;

  return (
    <div className="mt-6">
      <p className="text-base leading-8 text-offwhite/70 md:text-lg md:leading-8">
        {caption}
      </p>

      <div className="mt-5 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
        <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] md:min-h-[320px]">
          {groupPhoto ? (
            <Image
              src={groupPhoto}
              alt="Mechanical sub-team group photo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full min-h-[240px] items-center justify-center md:min-h-[320px]">
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-offwhite/40">
                Group photo coming soon
              </p>
            </div>
          )}
        </div>

        <p className="text-base leading-8 text-offwhite/70 md:text-lg md:leading-8">
          {blurb}
        </p>
      </div>
    </div>
  );
}

function SubGroup({
  title,
  blurb,
  members,
}: {
  title: string;
  blurb: string;
  members: TeamMember[];
}) {
  return (
    <div>
      <h3 className="font-display text-base font-bold uppercase tracking-[0.16em] text-accent md:text-lg">
        {title}
      </h3>
      <p className="mt-3 max-w-2xl text-base leading-8 text-offwhite/70 md:text-lg md:leading-8">
        {blurb}
      </p>
      <MemberGrid members={members} />
    </div>
  );
}

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
                <SubGroup
                  title="Computer Vision"
                  blurb={softwareGroups.computerVision.blurb}
                  members={softwareGroups.computerVision.members}
                />
                <SubGroup
                  title="Control & Navigation"
                  blurb={softwareGroups.controlAndNavigation.blurb}
                  members={softwareGroups.controlAndNavigation.members}
                />
              </div>
            ) : tab === "Mechanical" ? (
              <GroupPhotoRoster
                members={subteams.Mechanical.members}
                groupPhoto={subteams.Mechanical.groupPhoto}
                blurb={subteams.Mechanical.blurb}
              />
            ) : (
              <div>
                <p className="max-w-2xl text-base leading-8 text-offwhite/70 md:text-lg md:leading-8">
                  {subteams.Electrical.blurb}
                </p>
                <MemberGrid members={subteams.Electrical.members} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
