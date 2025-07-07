import { Box, Flex, Text } from "@radix-ui/themes";
import theme from "../../../../theme";
import { useEffect, useState } from "react";
import NumericalInput from "../../../../components/NumericalInput";
import useAccount from "../../../../hooks/useAccount";
import { useModalHelper } from "../../../../components/ConnectWalletModal/utils";
import { UNIT } from "../../../../constants/applications";
import { useWithdrawSymbol } from "../../hooks/useWithdrawSymbol";

type InputComponentProps = {
  typedAmount: string;
  setTypedAmount: Function;
  balance: string | undefined;
  stakeSelected: boolean;
  currentVaultId: number;
};

const InputComponent: React.FC<InputComponentProps> = ({
  typedAmount,
  setTypedAmount,
  balance,
  stakeSelected,
  currentVaultId,
}) => {
  const { address: account } = useAccount();
  const { openModal } = useModalHelper();
  const [isMaxSelected, setIsMaxSelected] = useState<boolean>(false);

  const withdrawSymbol = useWithdrawSymbol(currentVaultId);

  const handleUserInput = (input: string) => {
    if (Number(input) !== Number(balance)) {
      setIsMaxSelected(false);
    }
    setTypedAmount(input);
  };

  const handleMaxInput = () => {
    setIsMaxSelected(true);
    return handleUserInput(balance!);
  };

  useEffect(() => {
    if (isMaxSelected && balance) {
      handleUserInput(balance);
    }
  }, [isMaxSelected, balance, handleUserInput]);

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
          {account && balance && (
            <Text
              size="1"
              onClick={handleMaxInput}
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: isMaxSelected ? theme.color.white : theme.color.grey3,
              }}
            >
              Bal: {balance}
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
          <Text
            size="3"
            weight={"bold"}
            style={{ color: theme.color.blue1, whiteSpace: "nowrap" }}
          >
            {stakeSelected ? UNIT : withdrawSymbol}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default InputComponent;
