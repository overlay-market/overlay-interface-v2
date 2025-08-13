import { Box, Flex, Text } from "@radix-ui/themes";
import React, { useMemo, useState } from "react";
import { useAddPopup } from "../../state/application/hooks";
import {
  GradientOutlineButton,
  GradientSolidButton,
} from "../../components/Button";
import NumericalInput from "../../components/NumericalInput";
import useAccount from "../../hooks/useAccount";
import { useModalHelper } from "../../components/ConnectWalletModal/utils";
import { useReadContract, useWriteContract } from "wagmi";
import { erc20Abi, maxUint256, parseUnits } from "viem";
import bs58 from "bs58";
import { TransactionType } from "../../constants/transaction";
import {
  BRIDGE_ABI,
  BRIDGE_CONTRACT_ADDRESS,
  OVL_TOKEN_ADDRESS,
  SOLANA_DEVNET_EID,
} from "../../constants/bridge";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import { wagmiConfig } from "../../providers/Web3Provider/wagmi";
import {
  BridgeContainer,
  GradientBorderBox,
  StyledInput,
} from "./bridge-styles";
import theme from "../../theme";
import { useOvlTokenBalance } from "../../hooks/useOvlTokenBalance";
import useDebounce from "../../hooks/useDebounce";

const toBytes32 = (addr: string): `0x${string}` => {
  const decoded = bs58.decode(addr);
  if (decoded.length !== 32) throw new Error("Invalid Solana address");
  return `0x${Buffer.from(decoded).toString("hex")}` as `0x${string}`;
};

const Bridge: React.FC = () => {
  const { address } = useAccount();
  const { openModal } = useModalHelper();
  const addPopup = useAddPopup();
  const { ovlBalance, refetch } = useOvlTokenBalance();

  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const debouncedAmount = useDebounce(amount, 500);

  const { data: allowance } = useReadContract({
    address: OVL_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address ?? "0x", BRIDGE_CONTRACT_ADDRESS],
    query: { enabled: Boolean(address) },
  });

  const { writeContractAsync } = useWriteContract();

  const title: string = useMemo(() => {
    const amount = parseFloat(debouncedAmount);
    if (isNaN(amount)) return "Bridge";
    if (ovlBalance && amount > ovlBalance)
      return "Amount Exceeds Available Balance";
    return "Bridge";
  }, [debouncedAmount, ovlBalance]);

  const handleBridge = async () => {
    if (!address) {
      openModal();
      return;
    }
    if (!amount || !destination) return;
    try {
      const amountWei = parseUnits(amount, 18);
      if ((allowance ?? 0n) < amountWei) {
        const approveHash = await writeContractAsync({
          address: OVL_TOKEN_ADDRESS,
          abi: erc20Abi,
          functionName: "approve",
          args: [BRIDGE_CONTRACT_ADDRESS, maxUint256],
        });
        addPopup(
          {
            txn: {
              hash: approveHash,
              success: true,
              message: "",
              type: TransactionType.APPROVAL,
            },
          },
          approveHash
        );
        await waitForTransactionReceipt(wagmiConfig, {
          hash: approveHash,
          confirmations: 1,
        });
      }

      const sendParam = {
        dstEid: SOLANA_DEVNET_EID,
        to: toBytes32(destination),
        amountLD: amountWei,
        minAmountLD: amountWei,
        extraOptions: "0x",
        composeMsg: "0x",
        oftCmd: "0x",
      } as const;

      const msgFee = await readContract(wagmiConfig, {
        address: BRIDGE_CONTRACT_ADDRESS,
        abi: BRIDGE_ABI,
        functionName: "quoteSend",
        args: [sendParam, false],
      });

      const hash = await writeContractAsync({
        address: BRIDGE_CONTRACT_ADDRESS,
        abi: BRIDGE_ABI,
        functionName: "send",
        args: [sendParam, msgFee, address],
        value: msgFee.nativeFee,
      });

      addPopup(
        {
          txn: {
            hash,
            success: true,
            message: "",
            type: TransactionType.BRIDGE_OVL,
          },
        },
        hash
      );

      await waitForTransactionReceipt(wagmiConfig, {
        hash,
        confirmations: 1,
      });
      await refetch();

      setAmount("");
      setDestination("");
    } catch (error: unknown) {
      let message = "Bridge failed";
      let type = "ERROR";
      if (error && typeof error === "object") {
        if (
          "shortMessage" in error &&
          typeof (error as { shortMessage?: unknown }).shortMessage === "string"
        ) {
          message = (error as { shortMessage: string }).shortMessage;
        } else if (
          "message" in error &&
          typeof (error as { message?: unknown }).message === "string"
        ) {
          message = (error as { message: string }).message.split("\n")[0];
        }
        if (
          "code" in error &&
          typeof (error as { code?: unknown }).code === "string"
        ) {
          type = (error as { code: string }).code;
        }
      }
      if (message.includes("Non-base58 character")) {
        message = "Invalid Solana address";
      }
      console.error(error);
      addPopup(
        {
          txn: {
            hash: Date.now().toString(),
            success: false,
            message,
            type,
          },
        },
        Date.now().toString()
      );
    }
  };

  return (
    <BridgeContainer>
      <Flex
        direction={"column"}
        width={{ initial: "343px", sm: "424px", lg: "459px" }}
        mt={{ sm: "120px", lg: "100px" }}
        mb={"100px"}
        gap={{ initial: "32px", sm: "28px" }}
      >
        <Text
          style={{ fontWeight: "600", textAlign: "center" }}
          size={{ initial: "6", sm: "7" }}
        >
          Bridge OVL to Solana Devnet
        </Text>
        <Text
          style={{
            fontWeight: "600",
            textAlign: "center",
            color: theme.color.blue1,
          }}
          size={{ initial: "4", sm: "5" }}
        >
          Balance:{" "}
          <span style={{ fontFamily: "Roboto Mono", paddingLeft: "14px" }}>
            {ovlBalance?.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 4,
            })}
          </span>{" "}
          OVL
        </Text>

        <GradientBorderBox>
          <Flex
            direction={"column"}
            width={"100%"}
            gap={"16px"}
            p={{ sm: "32px" }}
          >
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
                </Flex>
                <Flex justify="between">
                  <NumericalInput value={amount} handleUserInput={setAmount} />
                  <Text
                    size="3"
                    weight={"bold"}
                    style={{ color: theme.color.blue1 }}
                  >
                    OVL
                  </Text>
                </Flex>
              </Flex>
            </Box>

            <StyledInput
              type="text"
              value={destination}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDestination(e.target.value.trim())
              }
              placeholder="Solana Address"
            />

            {address ? (
              <GradientSolidButton
                title={title}
                handleClick={handleBridge}
                isDisabled={!amount || !destination || title !== "Bridge"}
              />
            ) : (
              <GradientOutlineButton
                title="Connect Wallet"
                handleClick={openModal}
              />
            )}
          </Flex>
        </GradientBorderBox>
      </Flex>
    </BridgeContainer>
  );
};

export default Bridge;
