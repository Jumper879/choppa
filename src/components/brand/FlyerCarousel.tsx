"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const SLIDE_COUNT = 12;
const SLIDES = Array.from({ length: SLIDE_COUNT }, (_, i) => ({
  src: `/carousel/flyer-${i + 1}.jpg`,
  alt: `Choppa flyer ${i + 1}`,
}));

export function FlyerCarousel({
  className = "",
  autoPlayMs = 4200,
  rounded = "rounded-3xl",
}: {
  className?: string;
  autoPlayMs?: number;
  rounded?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<number | undefined>(undefined);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[index] as HTMLElement | undefined;
    if (!child) return;
    track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setActive((prev) => {
        const next = (prev + 1) % SLIDES.length;
        scrollToIndex(next);
        return next;
      });
    }, autoPlayMs);
    return () => clearInterval(id);
  }, [autoPlayMs, scrollToIndex]);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const slideWidth = track.children[0]?.clientWidth || 1;
    const index = Math.round(track.scrollLeft / slideWidth);
    setActive((prev) => (prev === index ? prev : index));
  }

  function pauseThenResume() {
    pausedRef.current = true;
    window.clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, 5000);
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onTouchStart={pauseThenResume}
        onPointerDown={pauseThenResume}
        className={`flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth ${rounded} [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
      >
        {SLIDES.map((slide, i) => (
          <div key={slide.src} className="relative h-full w-full shrink-0 snap-start">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center gap-1.5">
        {SLIDES.map((slide, i) => (
          <span
            key={slide.src}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
