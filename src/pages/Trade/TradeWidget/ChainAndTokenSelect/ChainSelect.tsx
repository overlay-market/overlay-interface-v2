import useChains from "../../../../hooks/lifi/useChains";
import { Avatar, Box, Flex } from "@radix-ui/themes";
import theme from "../../../../theme";
import { useMemo, useState } from "react";
import Loader from "../../../../components/Loader";
import SearchBar from "../../../../components/SearchBar";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ChainSelectContainer, StyledScrollArea } from "./chain-select-styles";
import { useTradeActionHandlers } from "../../../../state/trade/hooks";

interface ChainSelectProps {
  onClose: () => void;
}

const ChainSelect: React.FC<ChainSelectProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { handleChainSelect } = useTradeActionHandlers();

  const { chains, isLoading } = useChains();

  const filteredChains = useMemo(() => {
    return chains?.filter((chain) =>
      chain.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [chains, searchTerm]);

  const handleChainClick = (chainId: number) => () => {
    handleChainSelect(chainId);
    onClose();
  };

  return (
    <ChainSelectContainer>
      <Flex direction="column" gap="8px">
        <SearchBar
          searchTerm={searchTerm}
          placeholder={"Search chain"}
          setSearchTerm={setSearchTerm}
          bgcolor={theme.color.background}
        />

        <StyledScrollArea>
          <Flex gap="12px" wrap={"wrap"} justify={"center"}>
            {isLoading ? (
              <Flex
                width={"100%"}
                pt={"20px"}
                justify={"center"}
                align={"center"}
              >
                <Loader />
              </Flex>
            ) : filteredChains && filteredChains.length > 0 ? (
              filteredChains.map((chain) => (
                <Tooltip.Provider key={chain.id}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Box
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={handleChainClick(chain.id)}
                      >
                        <Avatar
                          radius="full"
                          src={chain.logoURI}
                          fallback="A"
                        />
                      </Box>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      style={{
                        backgroundColor: theme.color.background,
                        color: theme.color.green2,
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    >
                      {chain.name}
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              ))
            ) : searchTerm ? (
              <Flex p="16px" style={{ color: theme.color.grey3 }}>
                No chains found
              </Flex>
            ) : null}
          </Flex>
        </StyledScrollArea>
      </Flex>
    </ChainSelectContainer>
  );
};

export default ChainSelect;
