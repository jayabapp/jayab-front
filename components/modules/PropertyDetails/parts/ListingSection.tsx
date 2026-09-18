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
    className={`flex scroll-mt-28 flex-col gap-4 py-6 md:scroll-mt-32 md:py-8 ${
      divider ? "border-b border-neutral-100" : ""
    }`}
  >
    <div className="flex items-center justify-between gap-3">
      <h2
        id={`${id}-title`}
        className="text-balance text-base font-bold text-neutral-900 md:text-lg"
      >
        {title}
      </h2>
      {action ? <div className="shrink-0">{action}</div> : <></>}
    </div>
    {children}
  </section>
);

export default ListingSection;
