"use client";

import { TeamTable } from "@/components/tables/team-table";

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <TeamTable showViewAll={false} />
    </div>
  );
}
