import { Box, Flex, Text } from "@radix-ui/themes";
import theme from "../../../../theme";
import { useEffect, useState } from "react";
import NumericalInput from "../../../../components/NumericalInput";
import useAccount from "../../../../hooks/useAccount";
import { useModalHelper } from "../../../../components/ConnectWalletModal/utils";
import useSDK from "../../../../providers/SDKProvider/useSDK";
import useMultichainContext from "../../../../providers/MultichainContextProvider/useMultichainContext";

type InputComponentProps = {
  typedAmount: string;
  setTypedAmount: Function;
};

const InputComponent: React.FC<InputComponentProps> = ({
  typedAmount,
  setTypedAmount,
}) => {
  const sdk = useSDK();
  const { chainId } = useMultichainContext();
  const { address: account } = useAccount();
  const { openModal } = useModalHelper();

  const [isMaxSelected, setIsMaxSelected] = useState<boolean>(false);
  const [ovlBalance, setOvlBalance] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        try {
          const ovlBalance = await sdk.ovl.balance(account, 8);
          ovlBalance && setOvlBalance(Math.trunc(Number(ovlBalance)));
        } catch (error) {
          console.error("Error fetching ovlBalance:", error);
        }
      }
    };

    fetchBalance();
  }, [chainId, account, sdk]);

  const handleUserInput = (input: string) => {
    if (Number(input) !== ovlBalance) {
      setIsMaxSelected(false);
    }
    setTypedAmount(input);
  };

  const handleMaxInput = () => {
    setIsMaxSelected(true);
    return handleUserInput(Number(ovlBalance).toFixed(6));
  };

  useEffect(() => {
    if (isMaxSelected && ovlBalance) {
      handleUserInput(ovlBalance.toString());
    }
  }, [isMaxSelected, ovlBalance, handleUserInput]);

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
          {account && (
            <Text
              size="1"
              onClick={handleMaxInput}
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: isMaxSelected ? theme.color.white : theme.color.grey3,
              }}
            >
              Bal: {ovlBalance}
            </Text>
          )}

          {!account && (
            <Text
              size="1"
              onClick={openModal}
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: theme.color.grey3,
              }}
            >
              Connect wallet to view balance
            </Text>
          )}
        </Flex>
        <Flex justify="between">
          <NumericalInput
            value={typedAmount}
            handleUserInput={handleUserInput}
          />
          <Text size="3" weight={"bold"} style={{ color: theme.color.blue1 }}>
            OVL
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default InputComponent;
