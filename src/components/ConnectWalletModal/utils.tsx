import { useWeb3Modal } from "@web3modal/wagmi/react";

export const useOpenWalletModal = async () => {
    const { open } = useWeb3Modal();

    try {
        await open();
    } catch (error) {
        console.error("Failed to connect:", error);
    }
}
