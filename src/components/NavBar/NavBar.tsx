import { Box, Flex, Link, Text } from "@radix-ui/themes";
import LogoImg from "../../assets/images/overlay-logo-only-no-background.png";
import { GradientOutlineButton } from "../Button/GradientButton";
import { theme } from "../../theme/theme";
import Xlogo from "../../assets/images/social-links/X_logo.png";
import MirrorLogo from "../../assets/images/social-links/Mirror.png";
import DiscordLogo from "../../assets/images/social-links/Discord.png";
import { LINKS } from "../../constants/links";

const NavBar = () => {
  return (
    <Box
      width={{ initial: "100%", md: "88px" }}
      height={{ initial: "65px", md: "100vh" }}
      py={{ initial: "0", md: "25px" }}
      px={{ initial: "15px", md: "6px" }}
      position={{ initial: "static", md: "sticky" }}
      top={"0"}
      style={{
        borderRight: `1px solid ${theme.darkBlue}`,
        borderBottom: `1px solid ${theme.darkBlue}`,
      }}
    >
      <Flex
        direction={{ initial: "row", md: "column" }}
        gap={{ initial: "20px", md: "100px" }}
        height={{ initial: "65px", md: "90vh" }}
        align={"center"}
      >
        <img src={LogoImg} alt="Logo" width={"40px"} height={"40px"} />

        <Flex
          direction="column"
          justify={"between"}
          flexGrow={"1"}
          display={{ initial: "none", md: "flex" }}
        >
          <Flex direction={"column"} gap={"10px"}>
            <Text>Home</Text>
            <Text>Trade</Text>
          </Flex>
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.5 1.5C6.5 0.947715 6.94772 0.5 7.5 0.5H10.5C11.0523 0.5 11.5 0.947715 11.5 1.5V2.5H15.5C16.0523 2.5 16.5 2.94772 16.5 3.5V6.5C16.5 7.3888 16.1131 8.18734 15.5 8.73608V12C15.5 12.8284 14.8284 13.5 14 13.5H4C3.17157 13.5 2.5 12.8284 2.5 12V8.7359C1.88697 8.18721 1.5 7.38883 1.5 6.5V3.5C1.5 2.94772 1.94772 2.5 2.5 2.5H6.5V1.5ZM10.5 1.5V2.5H7.5V1.5H10.5ZM2.5 3.5H6.5H7H11H11.5H15.5V6.5C15.5 7.154 15.1866 7.73467 14.6997 8.1004C14.3655 8.35144 13.9508 8.5 13.5 8.5H9.5V8C9.5 7.72386 9.27614 7.5 9 7.5C8.72386 7.5 8.5 7.72386 8.5 8V8.5H4.5C4.0493 8.5 3.6346 8.35133 3.30029 8.10022C2.81335 7.73446 2.5 7.15396 2.5 6.5V3.5ZM8.5 9.5H4.5C4.14961 9.5 3.81292 9.43972 3.5 9.32905V12C3.5 12.2761 3.72386 12.5 4 12.5H14C14.2761 12.5 14.5 12.2761 14.5 12V9.32915C14.1871 9.43978 13.8504 9.5 13.5 9.5H9.5V10C9.5 10.2761 9.27614 10.5 9 10.5C8.72386 10.5 8.5 10.2761 8.5 10V9.5Z"
              fill="#ECECEC"
            />
          </svg>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.3182 2.81825C5.49393 2.64251 5.49393 2.35759 5.3182 2.18185C5.14246 2.00611 4.85754 2.00611 4.6818 2.18185L2.1818 4.68185C2.00607 4.85759 2.00607 5.14251 2.1818 5.31825L4.6818 7.81825C4.85754 7.99398 5.14246 7.99398 5.3182 7.81825C5.49393 7.64251 5.49393 7.35759 5.3182 7.18185L3.5864 5.45005H13.5C13.7485 5.45005 13.95 5.24858 13.95 5.00005C13.95 4.75152 13.7485 4.55005 13.5 4.55005H3.5864L5.3182 2.81825ZM11.3151 8.18185C11.1393 8.00611 10.8544 8.00611 10.6787 8.18185C10.5029 8.35759 10.5029 8.64251 10.6787 8.81825L12.4105 10.55H2.49687C2.24835 10.55 2.04688 10.7515 2.04688 11C2.04688 11.2486 2.24835 11.45 2.49687 11.45H12.4105L10.6787 13.1819C10.5029 13.3576 10.5029 13.6425 10.6787 13.8182C10.8544 13.994 11.1393 13.994 11.3151 13.8182L13.8151 11.3182C13.9908 11.1425 13.9908 10.8576 13.8151 10.6819L11.3151 8.18185Z"
              fill="url(#paint0_linear_212_3620)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_212_3620"
                x1="2.04688"
                y1="8.00005"
                x2="13.95"
                y2="8.00005"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FFC955" />
                <stop offset="1" stop-color="#FF7CD5" />
              </linearGradient>
            </defs>
          </svg>
          <Flex direction={"column"} gap={"20px"}>
            <GradientOutlineButton
              title={"Buy OV"}
              width={"78px"}
              height={"29px"}
              onClick={() => {
                console.log("buy OV!");
              }}
            />
            <Flex justify={"between"}>
              <Link href={LINKS.X} target="blank">
                <img src={Xlogo} alt="XLogo" width={"16px"} height={"16px"} />
              </Link>
              <Link href={LINKS.DISCORD} target="blank">
                <img
                  src={DiscordLogo}
                  alt="DiscordLogo"
                  width={"16px"}
                  height={"16px"}
                />
              </Link>
              <Link href={LINKS.MIRROR} target="blank">
                <img
                  src={MirrorLogo}
                  alt="MirrorLogo"
                  width={"16px"}
                  height={"16px"}
                />
              </Link>
            </Flex>
          </Flex>
        </Flex>

        <Box display={{ initial: "block", md: "none" }}>NavBar Hamburger</Box>
      </Flex>
    </Box>
  );
};

export default NavBar;
