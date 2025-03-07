import { useState } from "react";
import MenuHamburger from "./MenuHamburger";
import { Box, DropdownMenu, Flex } from "@radix-ui/themes";
import {
  DropdownContent,
  HeaderMenuButton,
  Separator,
} from "./header-menu-styles";
import NavLinksSection from "../NavBar/NavLinksSection";
import SocialLinksSection from "../NavBar/SocialLinksSection";
import { NAVBAR_MODE } from "../../constants/applications";

const HeaderMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger>
        <HeaderMenuButton onClick={() => setOpen(true)}>
          <MenuHamburger open={open} />
        </HeaderMenuButton>
      </DropdownMenu.Trigger>

      <DropdownContent sideOffset={10} align="end">
        <Box
          display={{ initial: "block", sm: "none" }}
          width={{ initial: "auto" }}
          onClick={() => setOpen(false)}
        >
          <NavLinksSection mode={NAVBAR_MODE.BURGER} />
        </Box>

        <Separator />

        <Flex
          display={{ initial: "flex", sm: "none" }}
          onClick={() => setOpen(false)}
        >
          <SocialLinksSection />
        </Flex>
      </DropdownContent>
    </DropdownMenu.Root>
  );
};

export default HeaderMenu;
