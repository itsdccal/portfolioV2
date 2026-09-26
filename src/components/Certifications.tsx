import SectionHeading from "./SectionHeading";
import { profile } from "@/data/profile";

export default function Certifications() {
  return (
    <section id="certifications" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="006" title="Certifications" />

        <ul className="border-t border-border">
          {profile.certifications.map((cert, i) => (
            <li
              key={cert.title}
              className="group flex flex-col gap-2 border-b border-border py-6 transition-colors hover:bg-border/20 sm:flex-row sm:items-baseline sm:gap-10 sm:px-4"
            >
              <span className="shrink-0 font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-lg font-semibold tracking-tight transition-transform duration-200 group-hover:translate-x-1">
                  {cert.title}
                </h3>
                <p className="font-serif italic text-muted">{cert.issuer}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
