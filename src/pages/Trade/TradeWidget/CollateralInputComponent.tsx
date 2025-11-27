import { Box, Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import { useCallback, useEffect, useState } from "react";
import NumericalInput from "../../../components/NumericalInput";
import {
  useTradeActionHandlers,
  useTradeState,
  useCollateralType,
} from "../../../state/trade/hooks";
import { useSearchParams } from "react-router-dom";
import { useMaxInputIncludingFees } from "../../../hooks/useMaxInputIncludingFees";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { formatWeiToParsedNumber } from "overlay-sdk";
import useDebounce from "../../../hooks/useDebounce";
import { parseUnits } from "viem";
import { useStableTokenInfo } from "../../../hooks/useStableTokenInfo";

const CollateralInputComponent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get("market");
  const sdk = useSDK();
  const { typedValue } = useTradeState();
  const collateralType = useCollateralType();
  const { handleAmountInput } = useTradeActionHandlers();
  const { maxInputIncludingFees, isLoading, error } = useMaxInputIncludingFees({
    marketId,
  });

  const [isMaxSelected, setIsMaxSelected] = useState<boolean>(false);
  const [ovlPreview, setOvlPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const debouncedTypedValue = useDebounce(typedValue, 500);

  // Fetch stable token info with oracle price
  const { data: stableTokenInfo, refetch: refetchStableTokenInfo, isRefetching } = useStableTokenInfo({
    includeOraclePrice: true,
  });

  // Fetch OVL preview when USDT is selected
  useEffect(() => {
    if (collateralType !== 'USDT' || !debouncedTypedValue || Number(debouncedTypedValue) === 0 || !stableTokenInfo) {
      setOvlPreview(null);
      return;
    }

    const fetchPreview = async () => {
      setPreviewLoading(true);
      try {
        const stableAmount = parseUnits(debouncedTypedValue, stableTokenInfo.decimals);
        const ovlAmount = await sdk.lbsc.previewBorrow(stableAmount);
        const formattedOvl = formatWeiToParsedNumber(ovlAmount, 18, 4);
        setOvlPreview(formattedOvl?.toString() ?? null);
      } catch (err) {
        setOvlPreview(null);
      } finally {
        setPreviewLoading(false);
      }
    };

    fetchPreview();
  }, [collateralType, debouncedTypedValue, stableTokenInfo, sdk]);

  const handleUserInput = useCallback(
    (input: string) => {
      const inputValue = Number(input);
      if (inputValue !== maxInputIncludingFees) {
        setIsMaxSelected(false);
      }
      handleAmountInput(input);
    },
    [handleAmountInput, maxInputIncludingFees]
  );

  const handleMaxInput = useCallback(() => {
    if (maxInputIncludingFees > 0) {
      setIsMaxSelected(true);
      handleUserInput(maxInputIncludingFees.toFixed(6));
    }
  }, [maxInputIncludingFees, handleUserInput]);

  // Update amount input when max selected and leverage is changed (thus maxInputIncludingFees changes)
  useEffect(() => {
    if (isMaxSelected && maxInputIncludingFees) {
      handleUserInput(maxInputIncludingFees.toString());
    }
  }, [isMaxSelected, maxInputIncludingFees, handleUserInput]);

  return (
    <Box
      width={"100%"}
      p={"8px"}
      style={{ borderRadius: "8px", background: theme.color.grey4 }}
    >
      <Flex direction={"column"} gap="22px">
        <Flex justify="between">
          <Text size="1" style={{ color: theme.color.grey3 }}>
            Amount
          </Text>
          <Text
            size="1"
            onClick={maxInputIncludingFees > 0 ? handleMaxInput : undefined}
            style={{
              textDecoration: "underline",
              cursor: maxInputIncludingFees > 0 ? "pointer" : "not-allowed",
              color: isMaxSelected ? theme.color.white : theme.color.grey3,
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? "Loading..." : `Max: ${maxInputIncludingFees} ${collateralType}`}
          </Text>
          {error && (
            <Text size="1" style={{ color: theme.color.red1 }}>
              Error loading max amount
            </Text>
          )}
        </Flex>

        <Flex justify="between">
          <NumericalInput
            value={typedValue}
            handleUserInput={handleUserInput}
          />
          <Text size="3" weight={"bold"} style={{ color: theme.color.blue1 }}>
            {collateralType}
          </Text>
        </Flex>

        {collateralType === 'USDT' && (
          <>
            <Flex justify="between" style={{ marginTop: '8px' }}>
              <Text size="1" style={{ color: theme.color.grey3 }}>
                OVL Collateral
              </Text>
              <Text size="1" style={{ color: theme.color.blue1 }}>
                {previewLoading ? 'Calculating...' : ovlPreview ? `~${ovlPreview} OVL` : '-'}
              </Text>
            </Flex>
            <Flex justify="between" style={{ marginTop: '4px' }}>
              <Flex align="center" gap="1">
                <Text size="1" style={{ color: theme.color.grey3 }}>
                  Borrow Price
                </Text>
                <Text
                  size="1"
                  onClick={() => refetchStableTokenInfo()}
                  style={{
                    color: theme.color.blue1,
                    cursor: 'pointer',
                    userSelect: 'none',
                    opacity: isRefetching ? 0.5 : 1,
                    transition: 'opacity 0.2s'
                  }}
                  title="Refresh oracle price"
                >
                  {isRefetching ? '⟳' : '↻'}
                </Text>
              </Flex>
              <Text size="1" style={{ color: theme.color.grey2 }}>
                {stableTokenInfo?.oraclePrice
                  ? `1 OVL = $${formatWeiToParsedNumber(stableTokenInfo.oraclePrice, 18, 4)?.toFixed(4) ?? '0.0000'}`
                  : '-'}
              </Text>
            </Flex>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default CollateralInputComponent;
