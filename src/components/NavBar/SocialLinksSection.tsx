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

const SocialLinksSection = () => {
  return (
    <Flex justify={"between"}>
      {SOCIAL_LINKS.map((link) => (
        <Link href={link.href} target="blank">
          <img src={link.src} alt={link.alt} width={"16px"} height={"16px"} />
        </Link>
      ))}
    </Flex>
  );
};

export default SocialLinksSection;
