import { Link } from "@tanstack/react-router";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";

import { AdSlot } from "@/components/common/AdSlot";
import { toolTree } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-14 hidden h-[calc(100dvh-3.5rem)] shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-200 lg:flex",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between px-3 py-3">
        {!collapsed && (
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Tool directory
          </span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      <nav aria-label="Tool directory" className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {toolTree.map((group) => (
          <div key={group.category}>
            {!collapsed && (
              <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {group.category}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.tools.map((tool) =>
                tool.path ? (
                  <li key={tool.name}>
                    <Link
                      to={tool.path}
                      className="block truncate rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      activeProps={{ className: "bg-accent text-foreground font-medium" }}
                    >
                      {collapsed ? tool.name.slice(0, 2) : tool.name}
                    </Link>
                  </li>
                ) : (
                  <li
                    key={tool.name}
                    className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground/70"
                  >
                    <span className="truncate">{collapsed ? tool.name.slice(0, 2) : tool.name}</span>
                    {!collapsed && (
                      <span className="rounded border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                        Soon
                      </span>
                    )}
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="border-t border-border p-3">
          <AdSlot width={300} height={250} />
        </div>
      )}
    </aside>
  );
}
