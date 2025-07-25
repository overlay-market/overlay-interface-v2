import { Box, Flex, Text } from "@radix-ui/themes";
import theme from "../../../../theme";
import { useMemo, useState } from "react";
import ChainSelect from "./ChainSelect";
import {
  useSelectStateManager,
  useTradeActionHandlers,
  useTradeState,
} from "../../../../state/trade/hooks";
import { DEFAULT_CHAINID } from "../../../../constants/chains";
import TokenSelect from "./TokenSelect";
import { StyledResetIcon } from "./chain-and-token-select-styles";
import { SelectState } from "../../../../types/selectChainAndTokenTypes";
import * as Tooltip from "@radix-ui/react-tooltip";
import ChainDisplay from "./ChainDisplay";
import TokenDisplay from "./TokenDisplay";

const ChainAndTokenSelect: React.FC = () => {
  const [showChainSelect, setShowChainSelect] = useState(false);
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const { chainState, tokenState } = useTradeState();
  const { handleChainSelect } = useTradeActionHandlers();

  useSelectStateManager();

  const handleChainToggle = () => {
    setShowChainSelect((prev) => {
      if (!prev) setShowTokenSelect(false);
      return !prev;
    });
  };

  const handleTokenToggle = () => {
    setShowTokenSelect((prev) => {
      if (!prev) setShowChainSelect(false);
      return !prev;
    });
  };

  const showResetIcon = useMemo(() => {
    if (
      chainState === SelectState.SELECTED ||
      tokenState === SelectState.SELECTED
    )
      return true;

    return false;
  }, [chainState, tokenState]);

  const handleResetIconClick = () => {
    setShowChainSelect(false);
    setShowTokenSelect(false);
    handleChainSelect(DEFAULT_CHAINID as number);
  };

  return (
    <Box style={{ position: "relative", width: "100%" }}>
      <Box
        width={"100%"}
        p={"8px"}
        style={{
          borderRadius:
            showChainSelect || showTokenSelect ? "8px 8px 0 0" : "8px",
          background: theme.color.grey4,
        }}
      >
        <Flex direction={"column"} gap="14px">
          <Flex justify="between">
            <Text size="1" style={{ color: theme.color.grey3 }}>
              Select{" "}
              {showChainSelect
                ? "chain"
                : showTokenSelect
                ? "token"
                : "collateral"}
            </Text>

            {showResetIcon && (
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <StyledResetIcon onClick={handleResetIconClick} />
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
                    Reset to default CHAIN / TOKEN
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}
          </Flex>

          <Flex justify="between">
            <ChainDisplay onClick={handleChainToggle} />
            <TokenDisplay onClick={handleTokenToggle} />
          </Flex>
        </Flex>
      </Box>
      {showChainSelect && (
        <ChainSelect onClose={() => setShowChainSelect(false)} />
      )}
      {showTokenSelect && (
        <TokenSelect onClose={() => setShowTokenSelect(false)} />
      )}
    </Box>
  );
};

export default ChainAndTokenSelect;
