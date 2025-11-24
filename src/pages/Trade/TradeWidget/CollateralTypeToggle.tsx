import { Text } from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";
import {
  useTradeActionHandlers,
  useCollateralType,
} from "../../../state/trade/hooks";
import {
  CollateralTypeButton,
  ToggleContainer,
} from "./collateral-type-toggle-styles";
import useSDK from "../../../providers/SDKProvider/useSDK";

const CollateralTypeToggle: React.FC = () => {
  const sdk = useSDK();
  const collateralType = useCollateralType();
  const { handleCollateralTypeChange, handleAmountInput } = useTradeActionHandlers();
  const [isLbscAvailable, setIsLbscAvailable] = useState(false);

  useEffect(() => {
    const checkLbscAvailability = async () => {
      try {
        const available = await sdk.lbsc.isAvailable();
        setIsLbscAvailable(available);
        // If LBSC not available and user had USDT selected, switch to OVL
        if (!available && collateralType === 'USDT') {
          handleCollateralTypeChange('OVL');
        }
      } catch {
        setIsLbscAvailable(false);
      }
    };
    checkLbscAvailability();
  }, [sdk, collateralType, handleCollateralTypeChange]);

  const handleSelect = useCallback(
    (type: 'OVL' | 'USDT') => {
      if (type !== collateralType) {
        handleCollateralTypeChange(type);
        // Clear input when switching collateral types
        handleAmountInput('');
      }
    },
    [collateralType, handleCollateralTypeChange, handleAmountInput]
  );

  // Don't render toggle if LBSC is not available
  if (!isLbscAvailable) {
    return null;
  }

  return (
    <ToggleContainer>
      <CollateralTypeButton
        $active={collateralType === 'OVL'}
        onClick={() => handleSelect('OVL')}
        aria-label="Use OVL as collateral"
        title="Use OVL as collateral"
      >
        <Text size="2" weight="medium">
          OVL
        </Text>
      </CollateralTypeButton>
      <CollateralTypeButton
        $active={collateralType === 'USDT'}
        onClick={() => handleSelect('USDT')}
        aria-label="Use USDT as collateral"
        title="Use USDT as collateral"
      >
        <Text size="2" weight="medium">
          USDT
        </Text>
      </CollateralTypeButton>
    </ToggleContainer>
  );
};

export default CollateralTypeToggle;
