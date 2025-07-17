import { ChainType, ExtendedChain } from "@lifi/sdk";
import useChains from "../../../../hooks/lifi/useChains";
import { Avatar, Box, Flex, Text } from "@radix-ui/themes";
import theme from "../../../../theme";
import { useEffect, useMemo, useState } from "react";
import ChainSelect from "./ChainSelect";
import { useTradeState } from "../../../../state/trade/hooks";
import { DEFAULT_CHAIN_LOGO, DEFAULT_NET } from "../../../../constants/chains";
import TokenSelect from "./TokenSelect";

const ChainAndTokenSelect: React.FC = () => {
  const [showChainSelect, setShowChainSelect] = useState(false);
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [selectedChain, setSelectedChain] = useState<
    ExtendedChain | undefined
  >();
  const [loadingChain, setLoadingChain] = useState<boolean>(true);
  const { selectedChainId, selectedToken } = useTradeState();

  const { getChainById, isLoading: chainsLoading } = useChains();

  useEffect(() => {
    let isMounted = true;

    setSelectedChain(undefined);
    setLoadingChain(true);

    if (!selectedChainId || chainsLoading) {
      return;
    }

    const chain = getChainById(selectedChainId);

    if (isMounted) {
      setSelectedChain(chain);
      setLoadingChain(false);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedChainId, chainsLoading, getChainById]);

  const handleChainSelect = () => {
    setShowChainSelect((prev) => {
      if (!prev) setShowTokenSelect(false);
      return !prev;
    });
  };

  const handleTokenSelect = () => {
    setShowTokenSelect((prev) => {
      if (!prev) setShowChainSelect(false);
      return !prev;
    });
  };

  const chainAvatarSrc = useMemo(() => {
    if (loadingChain || chainsLoading) return "";
    return selectedChain?.logoURI || DEFAULT_CHAIN_LOGO;
  }, [loadingChain, chainsLoading, selectedChain]);

  const chainName = useMemo(() => {
    if (loadingChain || chainsLoading) return "";
    return selectedChain?.name || DEFAULT_NET;
  }, [loadingChain, selectedChain, chainsLoading]);

  console.log({
    selectedChainId,
    selectedChain,
    loadingChain,
    chainAvatarSrc,
    chainName,
  });
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
          </Flex>

          <Flex justify="between">
            <Flex
              justify={"center"}
              align={"center"}
              gap={"1"}
              style={{ cursor: "pointer" }}
              onClick={handleChainSelect}
            >
              <Avatar radius="full" fallback="" src={chainAvatarSrc} />
              <Text
                size="2"
                weight={"medium"}
                style={{ color: theme.color.blue1 }}
              >
                {chainName}
              </Text>
            </Flex>

            <Flex
              justify={"center"}
              align={"center"}
              gap={"1"}
              style={{ cursor: "pointer" }}
              onClick={handleTokenSelect}
            >
              <Avatar
                radius="full"
                fallback=""
                src={selectedToken?.logoURI || ""}
              />
              <Text
                size="3"
                weight={"bold"}
                style={{ color: theme.color.blue1 }}
              >
                {selectedToken?.symbol}
              </Text>
            </Flex>
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
