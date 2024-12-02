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
import { useArcxAnalytics } from "@0xarc-io/analytics";
import useAccount from "../../../hooks/useAccount";

type UnwindButtonComponentProps = {
  position: OpenPositionData;
  unwindBtnState: string;
  inputValue: string;
  unwindPercentage: number;
  priceLimit: bigint;
  isPendingTime: boolean;
  handleDismiss: () => void;
};

const UnwindButtonComponent: React.FC<UnwindButtonComponentProps> = ({
  position,
  unwindBtnState,
  inputValue,
  unwindPercentage,
  priceLimit,
  isPendingTime,
  handleDismiss,
}) => {
  const sdk = useSDK();
  const addPopup = useAddPopup();
  const currentTimeForId = currentTimeParsed();
  const { handleTxnHashUpdate } = useTradeActionHandlers();
  const arcxAnalytics = useArcxAnalytics()
  const { address, chainId } = useAccount();

  const [attemptingUnwind, setAttemptingUnwind] = useState(false);

  const title: string | undefined = useMemo(() => {
    if (inputValue === "") return "Unwind";
    if (isPendingTime) return "Unwind";
    return unwindBtnState;
  }, [unwindBtnState, inputValue, isPendingTime]);

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
          handleTxnHashUpdate(result.hash, Number(result.receipt?.blockNumber));
          arcxAnalytics?.transaction({
            transactionHash: result.hash,
            account: address,
            chainId,
            metadata: {
              action: TransactionType.UNWIND_OVL_POSITION,
            },
          })
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

    const errorMessage =
      errorObj.cause?.shortMessage || errorObj.cause?.cause?.shortMessage;
    return { errorCode, errorMessage };
  };

  return (
    <>
      {!isDisabledUnwindButton && !attemptingUnwind && (
        <GradientSolidButton
          title={"Unwind"}
          width={"100%"}
          height={"46px"}
          handleClick={handleUnwind}
          isDisabled={isPendingTime}
        />
      )}

      {isDisabledUnwindButton && !attemptingUnwind && (
        <GradientOutlineButton
          title={title}
          width={"100%"}
          height={"46px"}
          size={"14px"}
          isDisabled={isDisabledUnwindButton}
        />
      )}

      {attemptingUnwind && (
        <GradientLoaderButton
          height={"46px"}
          size={"14px"}
          title={"Pending confirmation..."}
        />
      )}
    </>
  );
};

export default UnwindButtonComponent;
