import { Flex, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { useAddPopup } from "../../state/application/hooks";
import { GradientOutlineButton, GradientSolidButton } from "../../components/Button";
import NumericalInput from "../../components/NumericalInput";
import useAccount from "../../hooks/useAccount";
import { useModalHelper } from "../../components/ConnectWalletModal/utils";
import useSDK from "../../providers/SDKProvider/useSDK";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc20Abi, maxUint256, parseUnits } from "viem";
import bs58 from "bs58";
import { TransactionType } from "../../constants/transaction";
import { BRIDGE_ABI, BRIDGE_CONTRACT_ADDRESS, OVL_TOKEN_ADDRESS, SOLANA_DEVNET_EID } from "../../constants/bridge";
import { StyledInput } from "../Leaderboard/ReferralSection/referral-modal-styles";
import { readContract } from '@wagmi/core'
import { wagmiConfig } from "../../providers/Web3Provider/wagmi";

const toBytes32 = (addr: string): `0x${string}` => {
  const decoded = bs58.decode(addr);
  if (decoded.length !== 32) throw new Error("Invalid Solana address");
  return `0x${Buffer.from(decoded).toString("hex")}` as `0x${string}`;
};

const Bridge: React.FC = () => {
  const { address } = useAccount();
  const { openModal } = useModalHelper();
  const sdk = useSDK();
  const addPopup = useAddPopup();

  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [balance, setBalance] = useState<string>("0");

  const { data: allowance } = useReadContract({
    address: OVL_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address ?? "0x", BRIDGE_CONTRACT_ADDRESS],
    query: { enabled: Boolean(address) },
  });

  const { writeContractAsync } = useWriteContract();
  const waitForTransactionReceipt = useWaitForTransactionReceipt;

  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        try {
          const bal = await sdk.ovl.balance(address, 8);
          bal && setBalance(bal.toString());
        } catch (e) {
          console.error("Error fetching balance", e);
        }
      }
    };
    fetchBalance();
  }, [address, sdk]);

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
          { txn: { hash: approveHash, success: true, message: "", type: TransactionType.APPROVAL } },
          approveHash
        );
        await waitForTransactionReceipt({ hash: approveHash });
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
        { txn: { hash, success: true, message: "", type: TransactionType.BRIDGE_OVL } },
        hash
      );
    } catch (error: unknown) {
      let message = "Bridge failed";
      let type = "ERROR";
      if (error && typeof error === "object") {
        if ("message" in error && typeof (error as { message?: unknown }).message === "string") {
          message = (error as { message: string }).message;
        }
        if ("code" in error && typeof (error as { code?: unknown }).code === "string") {
          type = (error as { code: string }).code;
        }
      }
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
    <Flex
      width="100vw"
      height="80vh"
      justify="center"
      align="center"
      direction="column"
      px="16px"
      gap="12px"
    >
      <Text size="5" weight="medium">
        Bridge OVL to Solana Devnet
      </Text>
      <Text size="2">Balance: {balance} OVL</Text>
      <NumericalInput value={amount} handleUserInput={setAmount} placeholder="Amount" />
      <StyledInput
        type="text"
        value={destination}
        onChange={(e) => setDestination(e.target.value.trim())}
        placeholder="Solana Address"
      />
      {address ? (
        <GradientSolidButton title="Bridge" handleClick={handleBridge} />
      ) : (
        <GradientOutlineButton title="Connect Wallet" handleClick={openModal} />
      )}
    </Flex>
  );
};

export default Bridge;
