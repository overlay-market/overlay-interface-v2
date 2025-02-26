import { Text } from "@radix-ui/themes";
import Loader from "../Loader";
import NumberSpring from "../NumberSpring";
import theme from "../../theme";
import { useEffect, useState } from "react";
import useSDK from "../../providers/SDKProvider/useSDK";
import useAccount from "../../hooks/useAccount";
import { useIsNewTxnHash } from "../../state/trade/hooks";

const TokenBalance: React.FC = () => {
  const sdk = useSDK();
  const { address: account } = useAccount();
  const isNewTxnHash = useIsNewTxnHash();
  const [ovlBalance, setOvlBalance] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        try {
          const ovlBalance = await sdk.ovl.balance(account, 8);
          ovlBalance && setOvlBalance(Number(ovlBalance));
        } catch (error) {
          console.error("Error fetching ovlBalance:", error);
        }
      }
    };

    fetchBalance();
  }, [account, sdk, isNewTxnHash]);

  return (
    <Text
      size={"1"}
      style={{
        color: theme.color.grey2,
        fontFamily: "Roboto Mono, monospace",
        fontWeight: "500",
        opacity: 0.8,
      }}
    >
      {ovlBalance === undefined ? (
        <Loader size="12px" stroke="white" />
      ) : (
        <NumberSpring inputValue={ovlBalance} text="OVL" />
      )}
    </Text>
  );
};

export default TokenBalance;
