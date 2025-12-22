import { Flex, Text, Checkbox, DropdownMenu, IconButton } from "@radix-ui/themes";
import { GearIcon } from "@radix-ui/react-icons";
import theme from "../../theme";
import { useUnwindPreference, useTradeActionHandlers } from "../../state/trade/hooks";
import useAccount from "../../hooks/useAccount";

const SettingsDropdown: React.FC = () => {
  const { address: account } = useAccount();
  const unwindPreference = useUnwindPreference();
  const { handleUnwindPreferenceChange } = useTradeActionHandlers();

  if (!account) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton
          variant="ghost"
          style={{
            cursor: "pointer",
            color: theme.color.grey1,
          }}
        >
          <GearIcon width="20" height="20" />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        style={{
          backgroundColor: theme.color.background,
          border: `1px solid ${theme.color.darkBlue}`,
          borderRadius: "8px",
          padding: "8px",
          minWidth: "280px",
        }}
      >
        <Flex direction="column" gap="8px" p="4px">
          <Text size="2" weight="medium" style={{ color: theme.color.grey1 }}>
            Unwind Settings
          </Text>
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <Checkbox
              checked={unwindPreference === "stable"}
              onCheckedChange={(checked) =>
                handleUnwindPreferenceChange(checked ? "stable" : "normal")
              }
              style={{ marginTop: "2px" }}
            />
            <Flex direction="column" gap="4px">
              <Text size="2" style={{ color: theme.color.grey1 }}>
                Convert profits to USDT when unwinding
              </Text>
              <Text size="1" style={{ color: theme.color.grey3 }}>
                Uses 1inch to swap OVL profits to USDT
              </Text>
            </Flex>
          </label>
        </Flex>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default SettingsDropdown;
