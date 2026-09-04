export default function SectionHeading({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <div className="mb-12 border-b border-border pb-6 md:mb-16">
      <span className="font-mono text-sm text-muted">[{index}]</span>
      <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-6xl">
        {title}
      </h2>
    </div>
  );
}
