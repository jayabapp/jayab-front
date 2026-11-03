import type { ListingSectionProps } from "@/types/components/modules/property-details";

const ListingSection = ({
  id,
  title,
  action,
  children,
  divider = true,
}: ListingSectionProps) => (
  <section
    id={id}
    aria-labelledby={`${id}-title`}
    className={`flex scroll-mt-28 flex-col gap-5 py-8 md:scroll-mt-32 md:py-10 ${
      divider ? "border-b border-line" : ""
    }`}
  >
    <div className="flex items-center justify-between gap-3">
      <h2
        id={`${id}-title`}
        className="text-balance text-lg font-bold leading-8 text-ink md:text-xl md:leading-8"
      >
        {title}
      </h2>
      {action ? <div className="shrink-0">{action}</div> : <></>}
    </div>
    {children}
  </section>
);

export default ListingSection;
