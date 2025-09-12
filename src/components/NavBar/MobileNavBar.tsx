import React, { useRef, useState, useEffect } from "react";
import { Flex, IconButton } from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import NavLinksSection from "./NavLinksSection";
import { MobileNavBarContainer } from "./navbar-styles";
import theme from "../../theme";

export const MobileNavBar: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollBy = (offset: number) => {
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <MobileNavBarContainer>
      {canScrollLeft && (
        <IconButton
          onClick={() => scrollBy(-120)}
          size="2"
          variant="solid"
          style={{
            position: "absolute",
            left: 4,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            borderRadius: "50%",
            color: theme.color.grey2,
            backgroundColor: theme.color.grey4,
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}

      {canScrollRight && (
        <IconButton
          onClick={() => scrollBy(120)}
          size="2"
          variant="solid"
          style={{
            position: "absolute",
            right: 4,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            borderRadius: "50%",
            color: theme.color.grey2,
            backgroundColor: theme.color.grey4,
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}

      <Flex
        ref={scrollRef}
        direction="row"
        gap="16px"
        style={{
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <NavLinksSection />
      </Flex>
    </MobileNavBarContainer>
  );
};
