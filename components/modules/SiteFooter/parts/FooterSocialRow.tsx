import type { FooterSocialRowProps } from "@/types/components/modules/site-footer";

import ContactuUItem from "@/components/contactus/ContactuUItem";

const FooterSocialRow = ({ socials, className }: FooterSocialRowProps) => {
  if (!socials?.length) return null;

  return (
    <div className={className}>
      {socials.map((social) => (
        <ContactuUItem
          disableText
          e={social}
          isShiny={!!className?.includes("md:justify-start")}
          key={`footer-social-${social?.id}`}
        />
      ))}
    </div>
  );
};

export default FooterSocialRow;
