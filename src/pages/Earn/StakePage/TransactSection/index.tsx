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
import steerClient from "../../../../services/steerClient";
import { TransactionType } from "../../../../constants/transaction";
import { useAddPopup } from "../../../../state/application/hooks";
import { currentTimeParsed } from "../../../../utils/currentTime";
import { useParams } from "react-router-dom";
import { getVaultAddressByVaultName } from "../../utils/currentVaultdata";
import { parseUnits } from "viem";
import { handleError } from "../../../../utils/handleError";

const TransactSection: React.FC = () => {
  const { address: account } = useAccount();
  const { openModal } = useModalHelper();
  const { vaultId } = useParams();
  const vaultAddress = getVaultAddressByVaultName(vaultId);
  const addPopup = useAddPopup();
  const currentTimeForId = currentTimeParsed();

  const [stakeSelected, setStakeSelected] = useState(true);
  const [typedAmount, setTypedAmount] = useState("");

  const handleTransactionTypeSelect = (isStake: boolean) => {
    setStakeSelected(isStake);
  };

  const handleStake = async () => {
    if (!typedAmount) return;

    const parsedAmount = parseUnits(typedAmount, 18);

    steerClient.staking
      .stake({
        stakingPool: vaultAddress as `0x${string}`,
        amount: parsedAmount,
      })
      .then((stakeTx) => {
        if (stakeTx.success && stakeTx.data) {
          addPopup(
            {
              txn: {
                hash: stakeTx.data as string,
                success: stakeTx.success,
                message: "",
                type: TransactionType.STAKE_OVL,
              },
            },
            stakeTx.data
          );
        } else {
          addPopup(
            {
              txn: {
                hash: currentTimeForId,
                success: false,
                message: stakeTx.error ?? "Stake OVL failed",
                type: stakeTx.status,
              },
            },
            currentTimeForId
          );
        }
      })
      .catch((error: Error) => {
        const { errorCode, errorMessage } = handleError(error);

        addPopup(
          {
            txn: {
              hash: currentTimeForId,
              success: false,
              message: errorMessage,
              type: errorCode,
            },
          },
          currentTimeForId
        );
      });
  };

  const handleWithdraw = async () => {
    if (!typedAmount) return;

    const parsedAmount = parseUnits(typedAmount, 18);

    steerClient.staking
      .withdraw({
        stakingPool: vaultAddress as `0x${string}`,
        amount: parsedAmount,
      })
      .then((withdrawTx) => {
        if (withdrawTx.success && withdrawTx.data) {
          addPopup(
            {
              txn: {
                hash: withdrawTx.data as string,
                success: withdrawTx.success,
                message: "",
                type: TransactionType.WITHDRAW_OVL,
              },
            },
            withdrawTx.data
          );
        } else {
          addPopup(
            {
              txn: {
                hash: currentTimeForId,
                success: false,
                message: withdrawTx.error ?? "Withdraw OVL failed",
                type: withdrawTx.status,
              },
            },
            currentTimeForId
          );
        }
      })
      .catch((error: Error) => {
        const { errorCode, errorMessage } = handleError(error);

        addPopup(
          {
            txn: {
              hash: currentTimeForId,
              success: false,
              message: errorMessage,
              type: errorCode,
            },
          },
          currentTimeForId
        );
      });
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
          handleClick={stakeSelected ? handleStake : handleWithdraw}
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
