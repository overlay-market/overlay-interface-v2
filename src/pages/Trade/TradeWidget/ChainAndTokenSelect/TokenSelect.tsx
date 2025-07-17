import { TokenAmount } from "@lifi/sdk";
import { Avatar, Flex, Text } from "@radix-ui/themes";
import theme from "../../../../theme";
import { useMemo, useState } from "react";
import Loader from "../../../../components/Loader";
import SearchBar from "../../../../components/SearchBar";
import { ChainSelectContainer, StyledScrollArea } from "./chain-select-styles";
import { useTradeActionHandlers } from "../../../../state/trade/hooks";
import useTokenBalances from "../../../../hooks/lifi/useTokenBalances";
import { formatUnits } from "viem";
import { TokenItem } from "./token-select-styles";

interface TokenSelectProps {
  onClose: () => void;
}

const TokenSelect: React.FC<TokenSelectProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { handleTokenSelect } = useTradeActionHandlers();

  const {
    tokensWithBalance,
    isLoading: isTokensLoading,
    isBalanceLoading,
  } = useTokenBalances();

  const formatAmount = (
    amount: bigint | undefined,
    decimals: number
  ): string => {
    if (!amount || amount === 0n) return "0";

    const raw = parseFloat(formatUnits(amount, decimals));

    if (raw >= 1) {
      return raw.toFixed(6).replace(/\.?0+$/, "");
    } else if (raw >= 0.0001) {
      return raw.toFixed(6).replace(/\.?0+$/, "");
    } else {
      return raw.toPrecision(4).replace(/\.?0+$/, "");
    }
  };

  const tokensWithFormattedBalance = useMemo(() => {
    return (tokensWithBalance ?? [])
      .map((token) => {
        const amountDisplay = formatAmount(token.amount, token.decimals);
        const amountFloat = parseFloat(
          formatUnits(token.amount ?? 0n, token.decimals)
        );
        const amountUSD = amountFloat * parseFloat(token.priceUSD ?? "0");

        return {
          ...token,
          amountDisplay,
          amountUSD,
        };
      })
      .filter((token) => {
        const search = searchTerm.toLowerCase();
        return (
          token.symbol.toLowerCase().includes(search) ||
          token.name.toLowerCase().includes(search)
        );
      });
  }, [tokensWithBalance, searchTerm]);

  const handleTokenClick = (token: TokenAmount) => () => {
    handleTokenSelect(token);
    onClose();
  };

  return (
    <ChainSelectContainer>
      <Flex direction="column" gap="8px">
        <StyledScrollArea>
          {isTokensLoading || isBalanceLoading ? (
            <Loader />
          ) : tokensWithFormattedBalance?.length ? (
            <Flex direction="column">
              {tokensWithFormattedBalance?.length >= 5 && (
                <SearchBar
                  searchTerm={searchTerm}
                  placeholder={"Search token"}
                  setSearchTerm={setSearchTerm}
                  bgcolor={theme.color.background}
                />
              )}
              {tokensWithFormattedBalance.map((token) => (
                <TokenItem
                  key={`${token.chainId}-${token.address}`}
                  onClick={handleTokenClick(token)}
                >
                  <Flex align="center" gap="12px">
                    <Avatar
                      radius="full"
                      src={token.logoURI}
                      fallback={token.symbol.charAt(0)}
                    />
                    <Flex direction="column">
                      <Text weight={"bold"}>{token.symbol}</Text>
                      <Text
                        style={{
                          fontSize: "12px",
                          color: theme.color.grey3,
                        }}
                      >
                        {token.name}
                      </Text>
                    </Flex>
                  </Flex>

                  <Flex direction="column" align="end">
                    <Text>{token.amountDisplay}</Text>
                    <Text
                      style={{ fontSize: "12px", color: theme.color.grey3 }}
                    >
                      ${token.amountUSD.toFixed(2)}
                    </Text>
                  </Flex>
                </TokenItem>
              ))}
            </Flex>
          ) : (
            <Flex p="16px" style={{ color: theme.color.grey3 }}>
              No tokens with balance
            </Flex>
          )}
        </StyledScrollArea>
      </Flex>
    </ChainSelectContainer>
  );
};

export default TokenSelect;
