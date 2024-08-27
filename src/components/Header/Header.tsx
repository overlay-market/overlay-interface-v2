import { CardMedia } from "@mui/material";
import OverlayLogoOnlyDark from "../../assets/images/overlay-logo-only-no-background.png";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import SlideMenu from "./SlideMenu";
import MobileMenu from "./MobileMenu";
import { HeaderContainer, LogoContainer, StyledLink } from "./Header_";

export default function Header() {
  const [open, setOpen] = useState<boolean>(false);
  let location = useLocation().pathname;

  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [location]);

  return (
    <HeaderContainer>
      <LogoContainer>
        <CardMedia
          component="img"
          alt="Overlay Logo Light"
          height={"100%"}
          width={"100%"}
          image={OverlayLogoOnlyDark}
        />
      </LogoContainer>
      <StyledLink to={"/"}>Home</StyledLink>
      <MobileMenu open={open} setOpen={setOpen} />
      <SlideMenu open={open} setOpen={setOpen} />
    </HeaderContainer>
  );
}
