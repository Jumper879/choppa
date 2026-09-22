"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { ChoppaMark } from "@/components/brand/ChoppaMark";
import { FlyerCarousel } from "@/components/brand/FlyerCarousel";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useIsDesktop } from "@/lib/use-breakpoint";

type Theme = "day" | "night";

export default function SplashPage() {
  const isDesktop = useIsDesktop();

  if (isDesktop === null) {
    return <main className="min-h-screen bg-choppa-red" />;
  }

  return isDesktop ? <DesktopSplash /> : <MobileOnboarding />;
}

function DesktopSplash() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>("day");

  useEffect(() => {
    const t = setTimeout(() => router.push("/login"), 2600);
    return () => clearTimeout(t);
  }, [router]);

  const isNight = theme === "night";

  return (
    <main
      className={`relative flex min-h-screen flex-col items-center justify-center px-6 text-center transition-colors duration-500 ${
        isNight ? "bg-[#0d1f16] text-choppa-cream" : "bg-choppa-red text-choppa-cream"
      }`}
      onClick={() => router.push("/login")}
      role="button"
      aria-label="Continue to login"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setTheme(isNight ? "day" : "night");
        }}
        className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-white/15 p-1 pr-1 backdrop-blur-sm"
        aria-label="Toggle day and night preview"
      >
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
            !isNight ? "bg-white text-choppa-red" : "text-white/70"
          }`}
        >
          <Sun size={15} />
        </span>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
            isNight ? "bg-white text-[#0d1f16]" : "text-white/70"
          }`}
        >
          <Moon size={15} />
        </span>
      </button>

      <div className="flex flex-1 flex-col items-center justify-center">
        <video
          src="/brand/Mascot_walking_animation.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-[280px] rounded-3xl shadow-2xl sm:w-[360px]"
        />
        <h1 className="mt-5 font-display text-5xl font-bold uppercase tracking-tight sm:text-6xl">
          Choppa
        </h1>
        <p className="mt-3 max-w-xs text-base font-medium text-choppa-cream/90">
          Chop dey come. Chop am.
        </p>
      </div>

      <div className="mb-14 flex flex-col items-center gap-3">
        <Spinner size={30} />
        <p className="text-xs font-medium text-choppa-cream/70">
          Getting your Choppa ready &middot; tap to skip
        </p>
      </div>
    </main>
  );
}

function MobileOnboarding() {
  const router = useRouter();

  return (
    <main className="flex min-h-dvh flex-col bg-choppa-ink">
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2">
          <ChoppaMark size={28} />
          <span className="font-display text-lg font-bold text-choppa-cream">Choppa</span>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="text-sm font-semibold text-choppa-cream/70"
        >
          Skip
        </button>
      </div>

      <FlyerCarousel className="mx-4 mt-4 h-[60vh] min-h-[360px]" rounded="rounded-[2rem]" />

      <div className="px-6 pb-10 pt-6">
        <Button size="lg" className="w-full" onClick={() => router.push("/login")}>
          Get started <ArrowRight size={17} />
        </Button>
      </div>
    </main>
  );
}
