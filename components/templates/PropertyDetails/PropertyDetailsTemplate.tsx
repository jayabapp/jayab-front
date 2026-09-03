import type { PropertyDetailsTemplateProps } from "@/types/components/templates/property-details";
import { PropertyDetailsContent } from "@modules/PropertyDetails";

// Three columns from md: the content takes two, the sticky booking card one.
// It used to be two equal columns, which left the whole left half empty from
// the calendar down while the right half carried every spec section.
//
// No `items-start` here: that shrinks each grid item to its own content height,
// and a sticky child can only travel inside its parent's box — the booking card
// would scroll away immediately. Default `stretch` gives the side column the
// full row height to stick within. `!overflow-x-visible` matters for the same
// reason: `.container` sets `overflow-x: scroll`, and any non-visible overflow
// on an ancestor turns it into the sticky scroll container and kills sticking.
const PropertyDetailsTemplate = ({
  schema,
  devices,
  property,
}: PropertyDetailsTemplateProps) => (
  <div className="container grid !h-auto grid-cols-1 justify-start gap-4 !overflow-x-visible !pb-48 md:grid-cols-3 lg:!pb-36">
    {schema}
    <PropertyDetailsContent property={property} devices={devices} />
  </div>
);

export default PropertyDetailsTemplate;
