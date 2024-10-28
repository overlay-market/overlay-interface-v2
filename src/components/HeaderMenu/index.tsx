import { useState } from "react";
import MenuHamburger from "./MenuHamburger";
import { DropdownMenu, Flex, Text } from "@radix-ui/themes";
import useAccount from "../../hooks/useAccount";
import useDisconnect from "../../hooks/useDisconnect";
import {
  CHAIN_LIST,
  NETWORK_ICONS,
  SUPPORTED_CHAINID,
} from "../../constants/chains";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import theme from "../../theme";
import {
  ChainLogo,
  DropdownContent,
  DropdownItem,
  DropdownTitle,
  HeaderMenuButton,
} from "./header-menu-styles";

const networkLabel = (chainId: number) => {
  const isTestnet = [
    SUPPORTED_CHAINID.ARBITRUM_SEPOLIA,
    SUPPORTED_CHAINID.BARTIO,
    SUPPORTED_CHAINID.IMOLA,
  ].includes(chainId);

  return (
    <>
      <Text>{CHAIN_LIST[chainId]}</Text>
      {isTestnet ? (
        <Text style={{ color: theme.color.red1 }}>Testnet</Text>
      ) : null}
    </>
  );
};

const HeaderMenu = () => {
  const [open, setOpen] = useState(false);
  const { address: account, chainId } = useAccount();
  const { disconnect } = useDisconnect();

  const handleWalletDisconnect = () => {
    disconnect();
  };

  const { open: openConnectWalletModal } = useWeb3Modal();

  const handleWalletConnect = async () => {
    try {
      await openConnectWalletModal();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger>
        <HeaderMenuButton onClick={() => setOpen(true)}>
          <MenuHamburger open={open} />
        </HeaderMenuButton>
      </DropdownMenu.Trigger>

      <DropdownContent sideOffset={10} align="end">
        {account && chainId ? (
          <DropdownTitle>
            <Flex gap="8px">
              <ChainLogo src={NETWORK_ICONS[chainId as number]} />
              {networkLabel(chainId)}
            </Flex>
          </DropdownTitle>
        ) : (
          <DropdownItem onClick={handleWalletConnect}>
            <Text>Connect Wallet</Text>
          </DropdownItem>
        )}

        {account && (
          <DropdownItem onClick={handleWalletDisconnect}>
            <div>Disconnect Wallet</div>
          </DropdownItem>
        )}
      </DropdownContent>
    </DropdownMenu.Root>
  );
};

export default HeaderMenu;
