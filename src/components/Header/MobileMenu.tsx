import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import HeaderHamburger from "./HeaderHamburger";
import { theme } from "../../theme/theme";

const RelativeContainer = styled(`div`)({
  position: "relative",
  display: "block",
  width: "auto",
  marginLeft: "auto",

  [theme.breakpoints.up("md")]: {
    display: "none",
  },
});

const MenuButton = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  gap: 8px;
  background: #2e3343;
  position: relative;
  outline: none;
  border: 0;
  cursor: pointer;
`;

export default function MobileMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Function;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const showMenu = (val: boolean) => {
    setIsMenuOpen(val);
  };

  useEffect(() => {
    setIsMenuOpen(open);
  }, [open]);

  return (
    <RelativeContainer>
      <div onClick={() => showMenu(true)}>
        <MenuButton
          id="showButton"
          onClick={(event) => {
            event.stopPropagation();
            setOpen(!open);
          }}
        >
          <HeaderHamburger
            open={isMenuOpen}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
              setOpen(!open);
            }}
          />
        </MenuButton>
      </div>
    </RelativeContainer>
  );
}
