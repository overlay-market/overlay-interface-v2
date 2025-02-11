import { Flex, Text } from "@radix-ui/themes";
import React, { useState } from "react";
import {
  StakeSelectButton,
  TransactContainer,
  WithdrawSelectButton,
} from "./transact-section-styles";
import { GradientOutlineButton } from "../../../../components/Button";
import InputComponent from "./InputComponent";
import useAccount from "../../../../hooks/useAccount";
import { useModalHelper } from "../../../../components/ConnectWalletModal/utils";

const TransactSection: React.FC = () => {
  const { address: account } = useAccount();
  const { openModal } = useModalHelper();

  const [stakeSelected, setStakeSelected] = useState(true);
  const [typedAmount, setTypedAmount] = useState("");

  const handleTransactionTypeSelect = (isStake: boolean) => {
    setStakeSelected(isStake);
  };

  return (
    <TransactContainer>
      <Flex gap={"8px"}>
        <StakeSelectButton
          active={stakeSelected.toString()}
          onClick={() => handleTransactionTypeSelect(true)}
        >
          <Flex direction={"column"} justify={"center"} align={"center"}>
            <Text size={"3"} weight={"bold"}>
              Stake
            </Text>
          </Flex>
        </StakeSelectButton>
        <WithdrawSelectButton
          active={stakeSelected.toString()}
          onClick={() => handleTransactionTypeSelect(false)}
        >
          <Flex direction={"column"} justify={"center"} align={"center"}>
            <Text size={"3"} weight={"bold"}>
              Withdraw
            </Text>
          </Flex>
        </WithdrawSelectButton>
      </Flex>

      <InputComponent
        typedAmount={typedAmount}
        setTypedAmount={setTypedAmount}
      />

      {account && (
        <GradientOutlineButton
          title={stakeSelected ? "Stake" : "Withdraw"}
          width={"100%"}
          height={"40px"}
          size={"12px"}
          // isDisabled={isDisabledTransactButton}
          handleClick={() => {
            console.log({ typedAmount });
          }}
        />
      )}

      {!account && (
        <GradientOutlineButton
          title={"Connect Wallet to Deposit"}
          width={"100%"}
          height={"40px"}
          size={"12px"}
          handleClick={openModal}
        />
      )}
    </TransactContainer>
  );
};

export default TransactSection;
