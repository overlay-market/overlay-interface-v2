import { AlertDialog, Flex } from "@radix-ui/themes";
import theme from "../../theme";
import { ColorButton, GradientSolidButton } from "../Button";

export const VolatilityDialog = ({
  open,
  volatilityPercent,
  setOpen,
  handleCancel,
  handleContinue,
}: {
  open: boolean;
  volatilityPercent: string;
  setOpen: (v: boolean) => void;
  handleCancel: () => void;
  handleContinue: () => void;
}) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Content
        style={{ backgroundColor: theme.color.background, borderColor: "red" }}
      >
        <AlertDialog.Title>
          ⚠️ High Volatility Detected: {volatilityPercent}%
        </AlertDialog.Title>
        <AlertDialog.Description>
          <div>
            The underlying pool is experiencing high volatility, which may
            result in:
          </div>
          <div>- Higher slippage on your deposit</div>
          <div>- Receiving fewer vault shares than expected</div>
          <div>
            - Potential loss compared to waiting for volatility to decrease
          </div>
          <div>Do you want to proceed with the deposit?</div>
        </AlertDialog.Description>
        <Flex justify="end" gap="3" pt="16px">
          <AlertDialog.Cancel>
            <ColorButton
              onClick={handleCancel}
              width="140px"
              bgColor={theme.color.grey4}
              color={theme.color.grey1}
            >
              Cancel
            </ColorButton>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <GradientSolidButton
              title={"Continue"}
              handleClick={handleContinue}
              size={"14px"}
              width="140px"
              height="42px"
            />
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};
