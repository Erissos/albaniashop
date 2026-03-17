type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        {eyebrow ? <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p> : null}
        <h2 className="section-title">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}