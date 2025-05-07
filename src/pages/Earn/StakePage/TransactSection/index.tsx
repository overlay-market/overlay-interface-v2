import { Flex, Text } from "@radix-ui/themes";
import React, { useEffect, useMemo, useState } from "react";
import {
  StakeSelectButton,
  TransactContainer,
  WithdrawSelectButton,
} from "./transact-section-styles";
import {
  GradientLoaderButton,
  GradientOutlineButton,
} from "../../../../components/Button";
import InputComponent from "./InputComponent";
import useAccount from "../../../../hooks/useAccount";
import { useModalHelper } from "../../../../components/ConnectWalletModal/utils";
import useSDK from "../../../../providers/SDKProvider/useSDK";
import useMultichainContext from "../../../../providers/MultichainContextProvider/useMultichainContext";
import { formatDecimals } from "../../utils/formatDecimals";
import { useStake } from "../../hooks/useStake";
import { useWithdraw } from "../../hooks/useWithdraw";
import { useParams } from "react-router-dom";
import { useCurrentVault } from "../../hooks/useCurrentVaultData";
import { StakeSlippageModal } from "../../../../components/SlippageModal";

const TransactSection: React.FC = () => {
  const sdk = useSDK();
  const { chainId } = useMultichainContext();
  const { address: account } = useAccount();
  const { openModal } = useModalHelper();
  const { vaultId } = useParams();
  const currentVault = useCurrentVault(vaultId);

  const [stakeSelected, setStakeSelected] = useState(true);
  const [typedAmount, setTypedAmount] = useState("");
  const [ovlBalance, setOvlBalance] = useState<string | undefined>(undefined);

  if (!currentVault) {
    return null;
  }

  const {
    handleStake,
    buttonTitle: stakeBtnTitle,
    attemptingTransaction: stakeAttemptingTx,
  } = useStake({
    vaultId: currentVault!.id,
    typedAmount,
    setTypedAmount,
  });

  const {
    handleWithdraw,
    buttonTitle: withdrawBtnTitle,
    attemptingTransaction: withdrawAttemptingTx,
  } = useWithdraw({
    vaultId: currentVault!.id,
    typedAmount,
    setTypedAmount,
  });

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        try {
          const ovlBalance = await sdk.ovl.balance(account, 8);
          ovlBalance && setOvlBalance(formatDecimals(ovlBalance as string));
        } catch (error) {
          console.error("Error fetching ovlBalance:", error);
        }
      }
    };

    fetchBalance();
  }, [chainId, account, sdk]);

  const handleTransactionTypeSelect = (isStake: boolean) => {
    setStakeSelected(isStake);
  };

  const isTypedAmountExceeded = useMemo(() => {
    return stakeSelected
      ? Number(typedAmount) > Number(ovlBalance)
      : Number(typedAmount) > Number(0);
  }, [stakeSelected, typedAmount, ovlBalance]);

  const isDisabledButton = useMemo(() => {
    return !typedAmount || Number(typedAmount) === 0 || isTypedAmountExceeded;
  }, [typedAmount, isTypedAmountExceeded]);

  const buttonTitle = useMemo(() => {
    return isTypedAmountExceeded
      ? "Amount exceeds max input"
      : stakeSelected
      ? stakeBtnTitle
      : withdrawBtnTitle;
  }, [isTypedAmountExceeded, stakeSelected, stakeBtnTitle, withdrawBtnTitle]);

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
        balance={stakeSelected ? ovlBalance : "0"}
      />

      <Flex justify={"end"}>
        <StakeSlippageModal />
      </Flex>

      {account &&
        (stakeAttemptingTx || withdrawAttemptingTx ? (
          <GradientLoaderButton
            title={buttonTitle ?? "Pending confirmation..."}
            height={"40px"}
          />
        ) : (
          <GradientOutlineButton
            title={buttonTitle ?? (stakeSelected ? "Stake" : "Withdraw")}
            width={"100%"}
            height={"40px"}
            size={"12px"}
            isDisabled={isDisabledButton}
            handleClick={stakeSelected ? handleStake : handleWithdraw}
          />
        ))}

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
