import { Flex, Text, Checkbox } from "@radix-ui/themes";
import theme from "../../theme";
import { useUnwindPreference, useTradeActionHandlers } from "../../state/trade/hooks";

const UnwindPreferenceSection: React.FC = () => {
  const unwindPreference = useUnwindPreference();
  const { handleUnwindPreferenceChange } = useTradeActionHandlers();

  return (
    <Flex direction="column" gap="8px" p="12px">
      <Text size="2" weight="medium" style={{ color: theme.color.grey1 }}>
        Unwind Settings
      </Text>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
      >
        <Checkbox
          checked={unwindPreference === "stable"}
          onCheckedChange={(checked) =>
            handleUnwindPreferenceChange(checked ? "stable" : "normal")
          }
        />
        <Flex direction="column">
          <Text size="2" style={{ color: theme.color.grey1 }}>
            Convert profits to USDT when unwinding
          </Text>
          <Text size="1" style={{ color: theme.color.grey3 }}>
            Uses 1inch to swap OVL profits to USDT
          </Text>
        </Flex>
      </label>
    </Flex>
  );
};

export default UnwindPreferenceSection;
