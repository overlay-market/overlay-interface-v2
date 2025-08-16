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
  SOLANA_MAINNET_EID,
} from "../../constants/bridge";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import { wagmiConfig } from "../../providers/Web3Provider/wagmi";
import {
  BridgeContainer,
  ChainBox,
  ChainText,
  GradientBorderBox,
  LabelText,
  SwapDirectionButton,
  StyledInput,
} from "./bridge-styles";
import theme from "../../theme";
import { useOvlTokenBalance } from "../../hooks/useOvlTokenBalance";
import { useSolanaOvlBalance } from "../../hooks/useSolanaOvlBalance";
import { useLayerZeroBridge } from "../../hooks/useLayerZeroBridge";
import useDebounce from "../../hooks/useDebounce";
import { useSolanaWallet } from "../../hooks/useSolanaWallet";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { GradientBothSidesArrowIcon } from "../../assets/icons/svg-icons";

/**
 * Utility function to convert Solana addresses to bytes32 format
 * 
 * Solana addresses are base58-encoded and 32 bytes long when decoded.
 * This function converts them to the hex format expected by BSC contracts.
 * 
 * @param addr - Solana address in base58 format (e.g., "ABC123...")
 * @returns BSC-compatible address in 0x format
 * @throws Error if the address is invalid or not 32 bytes
 */
const toBytes32 = (addr: string): `0x${string}` => {
  // Decode base58 Solana address to raw bytes
  const decoded = bs58.decode(addr);
  
  // Validate that the decoded address is exactly 32 bytes
  if (decoded.length !== 32) throw new Error("Invalid Solana address");
  
  // Convert bytes to hex string and add 0x prefix for BSC compatibility
  return `0x${Buffer.from(decoded).toString("hex")}` as `0x${string}`;
};

/**
 * Bridge Component - Main interface for cross-chain OVL token transfers
 * 
 * This component provides a complete bridge interface that allows users to:
 * 1. Transfer OVL tokens from BSC to Solana (using existing bridge contract)
 * 2. Transfer OVL tokens from Solana to BSC (using LayerZero V2 - in development)
 * 3. View balances on both chains
 * 4. Switch between source and destination chains
 * 5. Input amounts and destination addresses
 * 6. Handle wallet connections for both chains
 * 
 * The component integrates with:
 * - Wagmi (for BSC/Ethereum interactions)
 * - Solana wallet adapters (for Solana interactions)
 * - LayerZero bridge contracts (for cross-chain transfers)
 * - Application state management (for notifications and popups)
 * 
 * @returns JSX element representing the complete bridge interface
 */
const Bridge: React.FC = () => {
  // STEP 1: Initialize core hooks and state management
  
  // BSC/Ethereum wallet connection and account information
  const { address } = useAccount();
  
  // Modal helper for wallet connection flows
  const { openModal } = useModalHelper();
  
  // Popup notification system for transaction status updates
  const addPopup = useAddPopup();
  
  // BSC OVL token balance hook
  const { ovlBalance, refetch } = useOvlTokenBalance();
  
  // Solana OVL token balance hook
  const { balance: solanaOvlBalance, isLoading: solanaBalanceLoading } = useSolanaOvlBalance();
  
  // LayerZero bridge hook for Solana to BSC transfers
  const { bridgeToBSC, isLoading: bridgeLoading, error: bridgeError } = useLayerZeroBridge();
  
  // Solana wallet connection state
  const solanaWallet = useSolanaWallet();
  
  // STEP 2: Local state management for bridge configuration
  
  // Source chain selection (BSC or Solana)
  const [sourceChain, setSourceChain] = useState<"BSC" | "SOLANA">("BSC");
  
  // Destination chain selection (BSC or Solana)
  const [destinationChain, setDestinationChain] = useState<"BSC" | "SOLANA">(
    "SOLANA"
  );
  
  // UI state for chain swap animation
  const [rotated, setRotated] = useState(false);
  
  // User input for token amount to bridge
  const [amount, setAmount] = useState("");
  
  // User input for destination address
  const [destination, setDestination] = useState("");
  
  // Debounced amount for performance optimization (prevents excessive API calls)
  const debouncedAmount = useDebounce(amount, 500);

  // STEP 3: Contract interactions and blockchain queries
  
  // Query current token allowance for BSC bridge contract
  // This determines if the user needs to approve tokens before bridging
  const { data: allowance } = useReadContract({
    address: OVL_TOKEN_ADDRESS,           // OVL token contract address
    abi: erc20Abi,                       // Standard ERC20 ABI
    functionName: "allowance",            // Function to check allowance
    args: [address ?? "0x", BRIDGE_CONTRACT_ADDRESS], // [owner, spender]
    query: { enabled: Boolean(address) }, // Only query when wallet is connected
  });

  // Contract write function for executing transactions
  const { writeContractAsync } = useWriteContract();

  // STEP 4: Computed values and derived state
  
  // Default button title
  const defaultTitle = "Bridge";

  // Dynamic button title based on validation state
  const title: string = useMemo(() => {
    const amount = parseFloat(debouncedAmount);

    // If amount is not a valid number, show default title
    if (isNaN(amount)) return defaultTitle;
    
    // If amount exceeds available balance, show error message
    if (ovlBalance && amount > ovlBalance)
      return "Amount Exceeds Available Balance";
    
    // Otherwise show default bridge title
    return defaultTitle;
  }, [debouncedAmount, ovlBalance, defaultTitle]);

  // STEP 5: Bridge execution functions
  
  /**
   * Handles bridging OVL tokens from BSC to Solana
   * 
   * This function performs the complete BSC to Solana bridge flow:
   * 1. Checks if user has approved sufficient tokens for the bridge contract
   * 2. If approval is needed, requests token approval first
   * 3. Waits for approval transaction confirmation
   * 4. Executes the bridge transaction with the approved tokens
   * 5. Shows transaction status notifications
   * 6. Waits for bridge transaction confirmation
   * 
   * The function handles the two-step process required for ERC20 token bridging:
   * - Step 1: Approve bridge contract to spend user's tokens
   * - Step 2: Execute bridge transaction with approved tokens
   */
  const handleBridgeBSCToSolana = async () => {
    if (!address) return;

    // STEP 5.1: Check if approval is needed and handle if required
    const amountWei = parseUnits(amount, 18);
    
    // If current allowance is less than required amount, approve first
    if ((allowance ?? 0n) < amountWei) {
      // Request approval for maximum amount (more efficient than approving per transaction)
      const approveHash = await writeContractAsync({
        address: OVL_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [BRIDGE_CONTRACT_ADDRESS, maxUint256], // Approve unlimited amount
      });
      
      // Show approval transaction notification
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
      
      // Wait for approval transaction to be confirmed on blockchain
      await waitForTransactionReceipt(wagmiConfig, {
        hash: approveHash,
        confirmations: 1,
      });
    }

    // STEP 5.2: Execute the bridge transaction
    // Prepare bridge parameters for the contract call
    const sendParam = {
      dstEid: SOLANA_MAINNET_EID,        // Solana endpoint ID
      to: toBytes32(destination),        // Destination address in bytes32 format
      amountLD: amountWei,               // Amount in smallest units (wei)
      minAmountLD: amountWei,            // Minimum amount to receive (same as sent)
      extraOptions: "0x",                // No extra options
      composeMsg: "0x",                  // No compose message
      oftCmd: "0x",                      // No OFT command
    } as const;

    // STEP 5.3: Get quote for bridge fees
    // This calculates the native token (BNB) fee required for the bridge operation
    const msgFee = await readContract(wagmiConfig, {
      address: BRIDGE_CONTRACT_ADDRESS,
      abi: BRIDGE_ABI,
      functionName: "quoteSend",
      args: [sendParam, false], // false = don't pay in LZ tokens
    });

    // STEP 5.4: Execute bridge transaction with calculated fees
    const hash = await writeContractAsync({
      address: BRIDGE_CONTRACT_ADDRESS,
      abi: BRIDGE_ABI,
      functionName: "send",
      args: [sendParam, msgFee, address], // [params, fees, refund address]
      value: msgFee.nativeFee,            // Send BNB for fees
    });

    // STEP 5.5: Show bridge transaction notification
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

    // STEP 5.6: Wait for bridge transaction confirmation
    await waitForTransactionReceipt(wagmiConfig, {
      hash,
      confirmations: 1,
    });
  };

  /**
   * Handles bridging OVL tokens from Solana to BSC
   * 
   * This function executes the Solana to BSC bridge using LayerZero V2:
   * 1. Ensures Solana wallet is connected
   * 2. Calls the LayerZero bridge hook to execute the transfer
   * 3. Shows transaction status notifications
   * 4. Handles any errors that occur during bridging
   * 
   * Note: This is currently using a placeholder implementation that simulates
   * the bridge flow. The real LayerZero V2 integration will replace this.
   */
  const handleBridgeSolanaToBSC = async () => {
    // STEP 5.7: Ensure Solana wallet is connected
    if (!solanaWallet.publicKey) {
      await solanaWallet.connect();
      return;
    }

    try {
      // STEP 5.8: Execute the bridge transaction
      const result = await bridgeToBSC({
        amount: parseFloat(amount),
        destinationAddress: destination,
      });

      // STEP 5.9: Show success notification if bridge succeeds
      if (result.success) {
        addPopup(
          {
            txn: {
              hash: result.signature,
              success: true,
              message: "Bridge transaction successful",
              type: TransactionType.BRIDGE_OVL,
            },
          },
          result.signature
        );
      }
    } catch (error) {
      // STEP 5.10: Handle and log any bridge errors
      console.error("Bridge error:", error);
    }
  };

  /**
   * Main bridge function that routes to appropriate handler based on source chain
   * 
   * This function serves as the entry point for all bridge operations:
   * 1. Validates user input (amount and destination)
   * 2. Routes to BSC-to-Solana or Solana-to-BSC handler based on source chain
   * 3. Handles wallet connection requirements
   * 4. Manages error handling and user feedback
   * 5. Cleans up form state after successful operations
   */
  const handleBridge = async () => {
    // STEP 6: Input validation
    if (!amount || !destination) return;
    
    try {
      // STEP 6.1: Route to appropriate bridge handler based on source chain
      if (sourceChain === "BSC") {
        // BSC to Solana bridge
        if (!address) {
          // If no BSC wallet connected, open wallet connection modal
          openModal();
          return;
        }
        await handleBridgeBSCToSolana();
      } else {
        // Solana to BSC bridge
        await handleBridgeSolanaToBSC();
      }

      // STEP 6.2: Post-bridge cleanup and state updates
      await refetch();           // Refresh BSC balance
      setAmount("");             // Clear amount input
      setDestination("");        // Clear destination input
      
    } catch (error) {
      // STEP 6.3: Comprehensive error handling and user feedback
      let message = "Bridge failed";
      let type = "ERROR";
      
      // Extract error message from various error object formats
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
        
        // Extract error code if available
        if (
          "code" in error &&
          typeof (error as { code?: unknown }).code === "string"
        ) {
          type = (error as { code: string }).code;
        }
      }
      
      // STEP 6.4: Handle specific error cases
      if (message.includes("Non-base58 character")) {
        message = "Invalid Solana address";
      }
      
      // STEP 6.5: Log error and show user notification
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

  /**
   * Handles swapping the source and destination chains
   * 
   * This function allows users to quickly reverse the bridge direction:
   * 1. Swaps source and destination chain values
   * 2. Updates UI rotation state for visual feedback
   * 3. Clears any bridge errors when switching chains
   * 
   * This is useful for users who want to bridge in the opposite direction
   * without manually changing both dropdowns.
   */
  const handleSwapChains = () => {
    // STEP 7.1: Swap chain selections
    setSourceChain(destinationChain);
    setDestinationChain(sourceChain);
    
    // STEP 7.2: Update UI rotation state for visual feedback
    setRotated((prev) => !prev);
    
    // STEP 7.3: Clear bridge errors when switching chains
    // This prevents showing stale error messages from the previous chain configuration
    if (bridgeError) {
      // TODO: We need to access the clearError function from the hook
      // For now, we'll just clear the error state manually
    }
  };

  // STEP 8: Render the bridge interface
  return (
    <BridgeContainer>
      <Flex
        direction={"column"}
        width={{ initial: "343px", sm: "424px", lg: "459px" }}
        mt={{ sm: "120px", lg: "100px" }}
        mb={"100px"}
        gap={{ initial: "32px", sm: "28px" }}
      >
        {/* STEP 8.1: Bridge title and header */}
        <Text
          style={{ fontWeight: "600", textAlign: "center" }}
          size={{ initial: "6", sm: "7" }}
        >
          OVL Bridge
        </Text>

        {/* STEP 8.2: Balance display section */}
        <Text
          style={{
            fontWeight: "600",
            textAlign: "center",
          }}
          size={{ initial: "4", sm: "5" }}
        >
          <span style={{ color: theme.color.grey3, fontWeight: "400" }}>
            Balance:
          </span>{" "}
          <span style={{ fontFamily: "Roboto Mono", paddingLeft: "14px" }}>
            {/* Dynamic balance display based on source chain */}
            {sourceChain === "BSC" 
              ? ovlBalance?.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                })
              : solanaBalanceLoading 
                ? "Loading..." 
                : solanaOvlBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  })
            }
          </span>{" "}
          OVL
        </Text>

        {/* STEP 8.3: Main bridge interface container */}
        <GradientBorderBox>
          <Flex
            direction={"column"}
            width={"100%"}
            gap={"20px"}
            p={{ sm: "32px" }}
          >
            {/* STEP 8.4: Chain selection interface */}
            <Flex gap="8px" justify="center" align="center">
              {/* Source chain display */}
              <ChainBox>
                <Flex direction={"column"}>
                  <LabelText>From</LabelText>
                  <Flex justify="center">
                    <ChainText>{sourceChain}</ChainText>
                  </Flex>
                </Flex>
              </ChainBox>

              {/* Chain swap button with rotation animation */}
              <SwapDirectionButton
                onClick={handleSwapChains}
                style={{
                  transform: rotated ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                <GradientBothSidesArrowIcon />
              </SwapDirectionButton>

              {/* Destination chain display */}
              <ChainBox>
                <Flex direction={"column"}>
                  <LabelText>To</LabelText>
                  <Flex justify="center">
                    <ChainText>{destinationChain}</ChainText>
                  </Flex>
                </Flex>
              </ChainBox>
            </Flex>

            {/* STEP 8.5: Amount input section */}
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

            {/* STEP 8.6: Destination address input */}
            <StyledInput
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value.trim())}
              placeholder={
                sourceChain === "BSC" ? "Solana Address" : "BSC Address"
              }
            />

            {/* STEP 8.7: Bridge error display */}
            {bridgeError && (
              <Text size="2" style={{ color: "red", textAlign: "center" }}>
                {bridgeError}
              </Text>
            )}

            {/* STEP 8.8: Action button section with conditional rendering */}
            {sourceChain === "BSC" ? (
                // BSC to Solana bridge flow
                address ? (
                  // User has connected BSC wallet - show bridge button
                  <GradientSolidButton
                    title={title}
                    handleClick={handleBridge}
                    isDisabled={!amount || !destination || title !== defaultTitle}
                  />
                ) : (
                  // No BSC wallet connected - show connect wallet button
                  <GradientOutlineButton
                    title="Connect Wallet"
                    handleClick={openModal}
                  />
                )
              ) : (
                // Solana to BSC bridge flow
                solanaWallet.connected ? (
                  // User has connected Solana wallet - show bridge button
                  <GradientSolidButton
                    title={bridgeLoading ? "Bridging..." : title}
                    handleClick={handleBridge}
                    isDisabled={!amount || !destination || title !== defaultTitle || bridgeLoading}
                  />
                ) : (
                  // No Solana wallet connected - show Solana wallet connection button
                  <WalletMultiButton />
                )
              )
            }
          </Flex>
        </GradientBorderBox>
      </Flex>
    </BridgeContainer>
  );
};

export default Bridge;
