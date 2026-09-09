"use client";

import { useEffect, useState } from "react";

/**
 * Current time in a fixed zone, refreshed every half minute. Renders
 * nothing until mounted so the server and client never disagree.
 */
export function LocalTime({ timeZone, label }: { timeZone: string; label?: string }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const tick = () => setNow(fmt.format(new Date()).toUpperCase());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {label && <span className="text-muted">{label} · </span>}
      {now ?? "  :  "}
    </span>
  );
}
