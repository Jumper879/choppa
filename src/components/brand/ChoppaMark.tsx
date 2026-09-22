import Image from "next/image";

export function ChoppaMark({
  size = 96,
  className = "",
  animated = false,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div
      className={`relative shrink-0 ${animated ? "animate-choppa-bob" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      <Image src="/icons/icon-192.png" alt="Choppa" fill sizes={`${size}px`} priority className="object-contain" />
    </div>
  );
}

export function ChoppaWordmark({ className = "" }: { className?: string }) {
  return <span className={`font-display font-bold tracking-tight ${className}`}>Choppa</span>;
}
