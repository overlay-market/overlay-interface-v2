import { Flex } from "@radix-ui/themes";
import LogoImg from "../../assets/images/overlay-logo-only-no-background.webp";
import NavLinksSection from "./NavLinksSection";
import { BrandButton, BrandText, LinksWrapper, TopNavShell } from "./navbar-styles";
import { useNavigate } from "react-router-dom";
import { MobileNavBar } from "./MobileNavBar";

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <TopNavShell>
        <Flex
          direction="row"
          gap="0"
          height="100%"
          align={"center"}
        >
          <BrandButton type="button" onClick={() => navigate(`/markets`)}>
            <img
              src={LogoImg}
              alt="Logo"
              width={"28px"}
              height={"28px"}
            />
            <BrandText>OVERLAY</BrandText>
          </BrandButton>

          <LinksWrapper direction="row" align="center" flexGrow={"1"}>
            <NavLinksSection />
          </LinksWrapper>
        </Flex>
      </TopNavShell>

      <MobileNavBar />
    </>
  );
};

export default NavBar;
