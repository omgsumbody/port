"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import MobileSplash from "@/components/MobileSplash";
import { markBooted } from "@/lib/boot";

// Pages that ship their own phone layout skip the "desktop recommended" splash.
const RESPONSIVE_ROUTES = ["/review-settings"];

export default function ViewportGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  // After the first hydration every page mount is an in-site navigation (no page loader).
  useEffect(markBooted, []);
  const responsive = RESPONSIVE_ROUTES.some((route) => pathname.startsWith(route));

  if (responsive) {
    return <>{children}</>;
  }

  return (
    <>
      <MobileSplash />
      <div className="hidden md:block">
        {children}
      </div>
    </>
  );
}
