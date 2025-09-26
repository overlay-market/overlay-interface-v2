import { Avatar, Flex, Skeleton, Text } from "@radix-ui/themes";
import theme from "../../../../theme";
import { useChainAndTokenState } from "../../../../state/trade/hooks";
import { SelectState } from "../../../../types/selectChainAndTokenTypes";
import { DEFAULT_TOKEN } from "../../../../constants/applications";
import { useAccount } from "wagmi";

interface TokenDisplayProps {
  onClick: () => void;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ onClick }) => {
  const { tokenState, selectedToken } = useChainAndTokenState();
  const { address: account } = useAccount();

  return (
    <Flex
      justify="center"
      align="center"
      gap="1"
      style={{ cursor: "pointer" }}
      onClick={
        account && tokenState !== SelectState.LOADING ? onClick : undefined
      }
    >
      {tokenState === SelectState.LOADING && (
        <>
          <Skeleton
            width="40px"
            height="40px"
            style={{ borderRadius: "50%" }}
          />
          <Text>
            <Skeleton style={{ borderRadius: "6px" }}>Select token</Skeleton>
          </Text>
        </>
      )}
      {tokenState === SelectState.EMPTY && (
        <>
          <Avatar
            radius="full"
            fallback=""
            style={{ background: theme.color.grey3, opacity: 0.3 }}
          />
          <Text size="2" weight={"medium"} style={{ color: theme.color.grey3 }}>
            Select token
          </Text>
        </>
      )}
      {tokenState === SelectState.DEFAULT && (
        <>
          <Avatar radius="full" fallback="" src={DEFAULT_TOKEN.logoURI} />
          <Text size="2" weight={"medium"} style={{ color: theme.color.blue1 }}>
            {DEFAULT_TOKEN.symbol}
          </Text>
        </>
      )}
      {tokenState === SelectState.SELECTED && (
        <>
          <Avatar radius="full" fallback="" src={selectedToken.logoURI} />
          <Text size="2" weight={"medium"} style={{ color: theme.color.blue1 }}>
            {selectedToken.symbol}
          </Text>
        </>
      )}
    </Flex>
  );
};

export default TokenDisplay;
