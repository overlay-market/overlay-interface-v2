import { useState, useCallback } from "react";
import {
  CHAIN_LIST,
  CHAIN_LIST_ORDER,
  NETWORK_ICONS,
  CHAIN_ID_LOCAL_STORAGE_KEY,
} from "../../constants/chains";
import useMultichainContext from "../../providers/MultichainContextProvider/useMultichainContext";
import { DropdownMenu, Flex } from "@radix-ui/themes";
import useChainSelect from "../../hooks/useChainSelect";
import {
  ChainLogo,
  DropdownContent,
  DropdownItem,
} from "./chain-switch-styles";

export { CHAIN_ID_LOCAL_STORAGE_KEY };

const ChainSwitch = () => {
  const { chainId, setSelectedChainId } = useMultichainContext();
  const chainSelect = useChainSelect();
  const [open, setOpen] = useState(false);

  const handleChainSelect = useCallback(
    async (targetChainId: number | undefined) => {
      if (!targetChainId) {
        setSelectedChainId(targetChainId);
      } else {
        setSelectedChainId(targetChainId);
        chainSelect(targetChainId);
        localStorage.setItem(CHAIN_ID_LOCAL_STORAGE_KEY, targetChainId.toString());
        sessionStorage.setItem("chainId", String(targetChainId));
      }
      setOpen(false);
    },
    [setSelectedChainId, chainSelect]
  );

  return (Object.keys(CHAIN_LIST_ORDER).length === 1
    ?
    <Flex align={"center"}>
      {chainId ? (
        <ChainLogo src={NETWORK_ICONS[chainId as number]} />
      ) : (
        <div>⚠️</div>
      )}
    </Flex>
    :
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger>
        <Flex align={"center"} style={{ cursor: "pointer" }}>
          {chainId ? (
            <ChainLogo src={NETWORK_ICONS[chainId as number]} />
          ) : (
            <div>⚠️</div>
          )}
        </Flex>
      </DropdownMenu.Trigger>

      <DropdownContent sideOffset={10} align="end">
        {Object.keys(CHAIN_LIST_ORDER).map((idValue: string) => {
          const id = Number(idValue);
          return (
            <DropdownItem
              key={id}
              onClick={() => handleChainSelect(CHAIN_LIST_ORDER[id])}
            >
              <ChainLogo src={NETWORK_ICONS[CHAIN_LIST_ORDER[id]]} />
              <div>{CHAIN_LIST[CHAIN_LIST_ORDER[id]]}</div>
            </DropdownItem>
          );
        })}
      </DropdownContent>
    </DropdownMenu.Root>
  );
};

export default ChainSwitch;
