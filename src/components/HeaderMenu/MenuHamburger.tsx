import { StyledBurger } from "./menu-hamburger-styles";

type BurgerProps = {
  open: boolean;
};

const MenuHamburger = ({ open }: BurgerProps) => {
  const isExpanded = open ? true : false;

  return (
    <StyledBurger
      aria-label="Toggle menu"
      aria-expanded={isExpanded}
      open={open}
    >
      <span />
      <span />
      <span />
    </StyledBurger>
  );
};

export default MenuHamburger;
