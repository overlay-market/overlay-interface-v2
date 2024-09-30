import {
  Flex,
  Text,
  Box,
  ChevronDownIcon,
  Avatar,
  ScrollArea,
} from "@radix-ui/themes";
import theme from "../../theme";
import useOutsideClick from "../../hooks/useOutsideClick";
import React, { useState, Fragment } from "react";
import { MarketItem, StyledSeparator } from "./markets-dropdown-list-styles";

const MarketsDropdownList: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClick(() => setIsOpen(false));
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const marketsList = [
    {
      logo: "1",
      marketName: "AI Index",
      price: "$12.23",
    },
    {
      logo: "1",
      marketName: "Counter-Strike 2 Skins Index fdsf fsdfsd",
      price: "$12.23",
    },
    {
      logo: "1",
      marketName: "AI Index",
      price: "$12.23",
    },
    {
      logo: "1",
      marketName: "AI Index",
      price: "$12.23",
    },
    {
      logo: "1",
      marketName: "AI Index",
      price: "$12.23",
    },
    {
      logo: "1",
      marketName: "AI Index",
      price: "$12.23",
    },
    {
      logo: "1",
      marketName: "AI Index",
      price: "$12.23",
    },
    {
      logo: "1",
      marketName: "AI Index",
      price: "$12.23",
    },
    {
      logo: "1",
      marketName: "AI Index",
      price: "$12.23",
    },
    {
      logo: "1",
      marketName: "AI Index",
      price: "$12.23",
    },
    {
      logo: "1",
      marketName: "AI Index",
      price: "$12.23",
    },
    {
      logo: "1",
      marketName: "AI Index",
      price: "$12.23",
    },
    {
      logo: "1",
      marketName: "AI Index",
      price: "$12.23",
    },
    {
      logo: "1",
      marketName: "AI Index",
      price: "$12.23",
    },
    {
      logo: "1",
      marketName: "AI Index",
      price: "$12.23",
    },
  ];

  return (
    <Box ref={ref}>
      <Flex
        width={"260px"}
        align={"center"}
        justify={"between"}
        p={"12px"}
        gap={"10px"}
        style={{ cursor: "pointer" }}
        onClick={toggleDropdown}
      >
        <Flex justify={"start"} align={"center"} gap={"10px"}>
          <Box
            width={"48px"}
            height={"48px"}
            style={{
              border: "1px solid #ECECEC26",
              borderRadius: "12px",
              boxShadow: "0px 4px 4px 0px #00000040",
            }}
          ></Box>
          <Text weight={"medium"} truncate>
            BTC Dominance
          </Text>
        </Flex>

        {isOpen ? (
          <ChevronDownIcon style={{ transform: "rotate(180deg)" }} />
        ) : (
          <ChevronDownIcon />
        )}
      </Flex>

      {isOpen && (
        <Box
          width={"260px"}
          height={"560px"}
          position={"absolute"}
          top={theme.headerSize.height}
          left={"0"}
          py={"16px"}
          style={{ background: theme.color.background }}
        >
          <ScrollArea type="auto" scrollbars="vertical" style={{ height: 530 }}>
            <Flex direction="column" align={"center"}>
              {marketsList.map((market, idx) => (
                <Fragment key={idx}>
                  <MarketItem
                    width={"100%"}
                    py={"12px"}
                    px={"4px"}
                    justify={"between"}
                    onClick={() => setIsOpen(false)}
                  >
                    <Flex gap={"10px"} width={"180px"}>
                      <Avatar
                        radius="full"
                        variant="solid"
                        size="1"
                        style={{ border: `0.5px solid ${theme.color.grey2}80` }}
                        fallback={
                          <Text style={{ fontSize: "6px" }}>{`logo`}</Text>
                        }
                        color="gray"
                      />
                      <Text weight={"medium"} truncate>
                        {market.marketName}
                      </Text>
                    </Flex>

                    <Text>{market.price}</Text>
                  </MarketItem>
                  <Box width={"100%"} px={"4px"}>
                    <StyledSeparator size="4" />
                  </Box>
                </Fragment>
              ))}
            </Flex>
          </ScrollArea>
        </Box>
      )}
    </Box>
  );
};

export default MarketsDropdownList;
