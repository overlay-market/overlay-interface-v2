import React from "react";
import { Flex, Link } from "@radix-ui/themes";
import Xlogo from "../../assets/icons/social-links/X_logo.png";
import MirrorLogo from "../../assets/icons/social-links/Mirror.png";
import DiscordLogo from "../../assets/icons/social-links/Discord.png";
import { LINKS } from "../../constants/links";

interface LinkAsset {
  alt: string;
  src: string;
  href: string;
}

const SOCIAL_LINKS: Array<LinkAsset> = [
  {
    alt: "XLogo",
    src: Xlogo,
    href: LINKS.X,
  },
  {
    alt: "DiscordLogo",
    src: DiscordLogo,
    href: LINKS.DISCORD,
  },
  {
    alt: "MirrorLogo",
    src: MirrorLogo,
    href: LINKS.MIRROR,
  },
];

const SocialLinksSection: React.FC = () => {
  return (
    <Flex
      direction={{ initial: "row", sm: "column", md: "row" }}
      justify={{ initial: "start", sm: "center", md: "between" }}
      align={{ sm: "center" }}
      px={{ initial: "20px", sm: "0" }}
      py={{ initial: "10px", sm: "0" }}
      gap={{ initial: "20px", sm: "4px", md: "0" }}
    >
      {SOCIAL_LINKS.map((link) => (
        <Link href={link.href} target="blank" key={link.href}>
          <Flex p={{ initial: "0", sm: "12px", md: "0" }}>
            <img src={link.src} alt={link.alt} width={"16px"} height={"16px"} />
          </Flex>
        </Link>
      ))}
    </Flex>
  );
};

export default SocialLinksSection;
