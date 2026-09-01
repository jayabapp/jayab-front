import type { FooterSocialRowProps } from "@/types/components/modules/site-footer";

import { ContactItem } from "@modules/ContactInfo";

const FooterSocialRow = ({ socials, className }: FooterSocialRowProps) => {
  if (!socials?.length) return null;

  return (
    <div className={className}>
      {socials.map((social) => (
        <ContactItem
          disableText
          e={social}
          key={`footer-social-${social?.id}`}
          isShiny={!!className?.includes("md:justify-start")}
        />
      ))}
    </div>
  );
};

export default FooterSocialRow;
