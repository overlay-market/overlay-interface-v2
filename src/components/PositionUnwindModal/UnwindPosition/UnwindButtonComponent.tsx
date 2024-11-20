import {
  GradientLoaderButton,
  GradientOutlineButton,
  GradientSolidButton,
} from "../../../components/Button";
import useSDK from "../../../providers/SDKProvider/useSDK";
import { useMemo, useState } from "react";
import { OpenPositionData, toWei } from "overlay-sdk";
import { Address } from "viem";
import { useAddPopup } from "../../../state/application/hooks";
import { currentTimeParsed } from "../../../utils/currentTime";
import { TransactionType } from "../../../constants/transaction";
import { useTradeActionHandlers } from "../../../state/trade/hooks";
import usePrevious from "../../../hooks/usePrevious";

type UnwindButtonComponentProps = {
  position: OpenPositionData;
  unwindBtnState: string;
  inputValue: string;
  unwindPercentage: number;
  priceLimit: bigint;
  handleDismiss: () => void;
};

const UnwindButtonComponent: React.FC<UnwindButtonComponentProps> = ({
  position,
  unwindBtnState,
  inputValue,
  unwindPercentage,
  priceLimit,
  handleDismiss,
}) => {
  const sdk = useSDK();
  const addPopup = useAddPopup();
  const { handleTxnHashUpdate } = useTradeActionHandlers();
  const previousInputValue = usePrevious(inputValue);
  const currentTimeForId = currentTimeParsed();

  const [attemptingUnwind, setAttemptingUnwind] = useState(false);

  const title: string | undefined = useMemo(() => {
    if (inputValue === "") return "Unwind";
    return unwindBtnState;
  }, [unwindBtnState, inputValue]);

  const isPendingTime = useMemo(() => {
    return inputValue !== previousInputValue;
  }, [inputValue, previousInputValue]);

  const isDisabledUnwindButton = useMemo(() => {
    return title === "Unwind" && inputValue !== "" ? false : true;
  }, [inputValue, title]);

  const handleUnwind = async () => {
    if (position && unwindPercentage && inputValue && priceLimit) {
      setAttemptingUnwind(true);

      sdk.market
        .unwind({
          marketAddress: position.marketAddress as Address,
          positionId: BigInt(position.positionId),
          fraction: toWei(unwindPercentage),
          priceLimit: priceLimit,
        })
        .then((result) => {
          handleTxnHashUpdate(result.hash);

          addPopup(
            {
              txn: {
                hash: result.hash,
                success: result.receipt?.status === "success",
                message: "",
                type: TransactionType.UNWIND_OVL_POSITION,
              },
            },
            result.hash
          );
        })
        .catch((error: Error) => {
          const { errorCode, errorMessage } = handleError(error);

          addPopup(
            {
              txn: {
                hash: currentTimeForId,
                success: false,
                message: errorMessage,
                type: errorCode,
              },
            },
            currentTimeForId
          );
        })
        .finally(() => {
          setAttemptingUnwind(false);
          handleDismiss();
        });
    }
  };

  const handleError = (error: Error) => {
    const errorString = JSON.stringify(error);
    const errorObj = JSON.parse(errorString);

    const errorCode: number | string =
      errorObj.cause?.cause?.code || errorObj.code;

    let errorMessage =
      errorObj.cause?.shortMessage || errorObj.cause?.cause?.shortMessage;
    return { errorCode, errorMessage };
  };

  return (
    <>
      {!isDisabledUnwindButton && !attemptingUnwind && (
        <GradientSolidButton
          title={"Unwind"}
          width={"100%"}
          height={"40px"}
          handleClick={handleUnwind}
          isDisabled={isPendingTime}
        />
      )}

      {isDisabledUnwindButton && !attemptingUnwind && (
        <GradientOutlineButton
          title={title}
          width={"100%"}
          height={"40px"}
          isDisabled={isDisabledUnwindButton}
        />
      )}

      {attemptingUnwind && (
        <GradientLoaderButton title={"Pending confirmation..."} />
      )}
    </>
  );
};

export default UnwindButtonComponent;
