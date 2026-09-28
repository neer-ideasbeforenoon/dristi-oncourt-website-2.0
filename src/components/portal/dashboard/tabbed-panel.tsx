"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DashboardPanel } from "./dashboard-panel";

type View = {
  value: string;
  label: string;
  content: React.ReactNode;
};

/**
 * A dashboard panel with two or more views of the same measure. Every view is
 * force-mounted and hidden with CSS, so all of them are in the server HTML; only
 * the selected one is shown.
 */
export function TabbedPanel({
  id,
  kicker,
  heading,
  tabsLabel,
  views,
}: {
  id: string;
  kicker: string;
  heading: string;
  tabsLabel: string;
  views: View[];
}) {
  const [value, setValue] = useState(views[0].value);

  return (
    <DashboardPanel id={id} kicker={kicker} heading={heading}>
      <Tabs value={value} onValueChange={setValue} className="gap-6">
        <TabsList aria-label={tabsLabel} className="max-w-full group-data-horizontal/tabs:h-10">
          {views.map((view) => (
            <TabsTrigger key={view.value} value={view.value} className="type-caption px-3 font-bold">
              {view.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {views.map((view) => (
          <TabsContent
            key={view.value}
            value={view.value}
            forceMount
            className="data-[state=inactive]:hidden"
          >
            {view.content}
          </TabsContent>
        ))}
      </Tabs>
    </DashboardPanel>
  );
}
