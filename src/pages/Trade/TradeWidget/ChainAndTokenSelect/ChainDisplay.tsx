import { Avatar, Flex, Skeleton, Text } from "@radix-ui/themes";
import theme from "../../../../theme";
import { useTradeState } from "../../../../state/trade/hooks";
import { useSelectedChain } from "../../../../hooks/lifi/useSelectedChain";
import { SelectState } from "../../../../types/selectChainAndTokenTypes";
import { DEFAULT_CHAIN_LOGO, DEFAULT_NET } from "../../../../constants/chains";
import { useMemo } from "react";
import { useAccount } from "wagmi";

interface ChainDisplayProps {
  onClick: () => void;
}

const ChainDisplay: React.FC<ChainDisplayProps> = ({ onClick }) => {
  const { chainState } = useTradeState();
  const { selectedChain, loadingChain } = useSelectedChain();
  const { address: account } = useAccount();

  const chainAvatarSrc = useMemo(() => {
    if (loadingChain) return "";
    return selectedChain?.logoURI;
  }, [loadingChain, selectedChain]);

  const chainName = useMemo(() => {
    if (loadingChain) return "";
    return selectedChain?.name;
  }, [loadingChain, selectedChain]);

  return (
    <Flex
      justify={"center"}
      align={"center"}
      gap={"1"}
      style={{ cursor: "pointer" }}
      onClick={
        account && chainState !== SelectState.LOADING ? onClick : undefined
      }
    >
      {chainState === SelectState.LOADING && (
        <>
          <Skeleton
            width="40px"
            height="40px"
            style={{ borderRadius: "50%" }}
          />
          <Text>
            <Skeleton style={{ borderRadius: "6px" }}>Select chain</Skeleton>
          </Text>
        </>
      )}
      {chainState === SelectState.EMPTY && (
        <>
          <Avatar radius="full" fallback="" />
          <Text size="2" weight={"medium"} style={{ color: theme.color.grey3 }}>
            Select chain...
          </Text>
        </>
      )}
      {chainState === SelectState.DEFAULT && (
        <>
          <Avatar radius="full" fallback="" src={DEFAULT_CHAIN_LOGO} />
          <Text size="2" weight={"medium"} style={{ color: theme.color.blue1 }}>
            {DEFAULT_NET}
          </Text>
        </>
      )}
      {chainState === SelectState.SELECTED && (
        <>
          <Avatar radius="full" fallback="" src={chainAvatarSrc} />
          <Text size="2" weight={"medium"} style={{ color: theme.color.blue1 }}>
            {chainName}
          </Text>
        </>
      )}
    </Flex>
  );
};

export default ChainDisplay;
