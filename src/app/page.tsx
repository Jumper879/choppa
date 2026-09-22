"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChoppaMark } from "@/components/brand/ChoppaMark";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/login"), 2200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-choppa-red px-6 text-center text-choppa-cream"
      onClick={() => router.push("/login")}
      role="button"
      aria-label="Continue to login"
    >
      <div className="flex flex-1 flex-col items-center justify-center">
        <ChoppaMark size={110} animated className="text-choppa-cream drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]" />
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight sm:text-6xl">
          Choppa
        </h1>
        <p className="mt-3 max-w-xs text-base font-medium text-choppa-cream/90">
          Chop dey come. Chop am.
        </p>
      </div>

      <div className="mb-14 flex w-full max-w-[200px] flex-col items-center gap-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
          <div className="h-full animate-choppa-progress rounded-full bg-white" />
        </div>
        <p className="text-xs font-medium text-choppa-cream/70">
          Getting your Choppa ready &middot; tap to skip
        </p>
      </div>
    </main>
  );
}
