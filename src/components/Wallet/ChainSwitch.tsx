import { NETWORK_ICONS } from "../../constants/chains";
import useMultichainContext from "../../providers/MultichainContextProvider/useMultichainContext";
import { Flex } from "@radix-ui/themes";
import { ChainLogo } from "./chain-switch-styles";

export const CHAIN_ID_LOCAL_STORAGE_KEY = "selectedChainId";

const ChainSwitch = () => {
  const { chainId } = useMultichainContext();

  return (
    <Flex align={"center"}>
      {chainId ? (
        <ChainLogo src={NETWORK_ICONS[chainId as number]} />
      ) : (
        <div>⚠️</div>
      )}
    </Flex>
  );
};

export default ChainSwitch;
