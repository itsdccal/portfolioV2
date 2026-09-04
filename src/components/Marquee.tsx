import { profile } from "@/data/profile";

export default function Marquee() {
  const items = [...profile.principles, ...profile.principles];

  return (
    <div className="overflow-hidden border-y border-border py-4">
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className="mx-6 font-mono text-sm uppercase tracking-[0.3em] text-muted"
          >
            {item} <span className="ml-6 text-border">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
