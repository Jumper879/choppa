export function Spinner({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-block animate-choppa-spin rounded-full border-[3px] border-current/25 border-t-current ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}
