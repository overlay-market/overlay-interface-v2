import { ConnectKitButton } from "connectkit";
import { GradientSolidButton } from "../Button";
import TokenBalance from "../Wallet/TokenBalance";
import { Flex, Text } from "@radix-ui/themes";
import useMiniAppSdk from "../../providers/MiniAppSdkProvider/useMiniAppSdk";

const ConnectWalletModal: React.FC = () => {
  const {
    isWebViewEnvironment,
    walletAddress,
    isAuthenticating,
    authenticate,
    error,
  } = useMiniAppSdk();

  if (isWebViewEnvironment) {
    const displayAddress =
      walletAddress &&
      `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

    return (
      <Flex direction="column" align="end">
        <Text
          weight="bold"
          style={{ cursor: walletAddress ? "default" : "pointer" }}
          onClick={() => {
            if (!walletAddress && !isAuthenticating) {
              void authenticate();
            }
          }}
        >
          {displayAddress || (isAuthenticating ? "Authenticating..." : "Connect via Lemon Cash")}
        </Text>
        {walletAddress ? (
          <TokenBalance />
        ) : (
          <GradientSolidButton
            title={isAuthenticating ? "Authenticating..." : "Authenticate"}
            width={"136px"}
            height={"32px"}
            size="14px"
            handleClick={() => {
              void authenticate();
            }}
            isDisabled={isAuthenticating}
          />
        )}
        {error && (
          <Text
            size="1"
            style={{ marginTop: "4px", color: "#FF6B6B", textAlign: "right" }}
          >
            {error}
          </Text>
        )}
      </Flex>
    );
  }

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) =>
        isConnected ? (
          <Flex direction="column">
            <Text
              onClick={show}
              style={{ cursor: "pointer" }}
              weight={"bold"}
            >
              {ensName ?? truncatedAddress}
            </Text>
            <TokenBalance />
          </Flex>
        ) : (
          <GradientSolidButton
            title="Connect Wallet"
            width={"136px"}
            height={"32px"}
            size="14px"
            handleClick={show}
          />
        )
      }
    </ConnectKitButton.Custom>
  );
};

export default ConnectWalletModal;
