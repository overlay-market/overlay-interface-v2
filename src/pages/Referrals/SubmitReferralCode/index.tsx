import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
// import { useAffiliateAlias } from "../../../hooks/referrals/useAffiliateAlias";
// import { useTraderStatus } from "../../../hooks/referrals/useTraderStatus";
// import { useAffiliateAddress } from "../../../hooks/referrals/useAffiliateAddress";
import { isAddress } from "viem";
import { shortenAddress } from "../../../utils/web3";
// import AliasSubmit from "./AliasSubmit";
import { Success } from "./Success";
// import { SignedUp } from "./SignedUp";
import { Form } from "./Form";
import { Flex, Text } from "@radix-ui/themes";
import theme from "../../../theme";
import {
  GradientBorderBox,
  LineSeparator,
} from "./submit-referral-code-styles";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { ReferralAddAffiliateOrKOLCallbackState, useReferralAddAffiliateOrKOLCallback } from "../../../hooks/referrals/useReferralAddAffiliateOrKOLCallback";
import { useAddPopup } from "../../../state/application/hooks";

type SubmitReferralCodeProps = {
  affiliate: string;
  setAffiliate: React.Dispatch<React.SetStateAction<string>>;
  handleBack: () => void;
};

const SubmitReferralCode: React.FC<SubmitReferralCodeProps> = ({
  affiliate,
  setAffiliate,
  handleBack,
}) => {
  const { address: traderAddress, status } = useAccount();
  const addPopup = useAddPopup();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [succeededToSignUp, setSucceededToSignUp] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [storedError, setStoredError] = useState<string | null>(null);

  useEffect(() => {
    setErrorMessage(null);
  }, [affiliate, traderAddress]);

  // Detect when wallet connection status is resolved
  useEffect(() => {
    if (status === "connected" || status === "disconnected") {
      setIsInitialLoading(false);
    }

    // Fallback timeout to prevent infinite loader
    const timeout = setTimeout(() => {
      if (isInitialLoading) {
        console.warn(
          "Wallet status did not resolve, forcing isInitialLoading to false"
        );
        setIsInitialLoading(false);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [status, isInitialLoading]);

  // const { data: affiliateAliasData, isLoading: loadingAffiliate } =
  //   useAffiliateAlias(traderAddress);

  // const { data: traderStatusData, isLoading: loadingTrader } = useTraderStatus(
  //   traderAddress && !affiliateAliasData?.isValid ? traderAddress : undefined
  // );

  // const {
  //   data: aliasOfSignedUpAffiliate,
  //   isLoading: loadingAliasOfSignedUpAffiliate,
  // } = useAffiliateAlias(traderStatusData?.affiliate);

  // const traderSignedUpTo = useMemo(() => {
  //   const affiliateAddr = traderStatusData?.affiliate;
  //   if (!affiliateAddr) return "";
  //   return aliasOfSignedUpAffiliate?.alias ?? shortenAddress(affiliateAddr, 7);
  // }, [traderStatusData, aliasOfSignedUpAffiliate]);


  const {
    callback: referralAddAffiliateOrKOLCallback,
    state,
    error: hookError,
  } = useReferralAddAffiliateOrKOLCallback(affiliate as `0x${string}`);

  const handleSubmit = useCallback(async () => {
    if (!referralAddAffiliateOrKOLCallback) {
      setStoredError(
        isAddress(affiliate)
          ? "Not an Address"
          : "Transaction not ready"
      );
      addPopup({
        txn: {
          hash: Date.now().toString(),
          success: false,
          message: storedError || "Unknown error",
          type: "error",
        },
      });
      return;
    }

    try {
      await referralAddAffiliateOrKOLCallback();
      setSucceededToSignUp(true)
      setStoredError(null);
    } catch (callbackError: any) {
      console.error("Error creating affiliate:", callbackError);
      const message =
        callbackError?.message ||
        hookError ||
        "Failed to create referral affiliate";
      setStoredError(message);

      addPopup({
        txn: {
          hash: Date.now().toString(),
          success: false,
          message,
          type: "error",
        },
      });
    }
  }, [
    referralAddAffiliateOrKOLCallback,
    addPopup,
    hookError,
    storedError,
  ]);

  const isLoading = state === ReferralAddAffiliateOrKOLCallbackState.LOADING

  const renderContent = () => {
    // if (affiliateAliasData?.isValid)
    //   return <AliasSubmit alias={affiliateAliasData.alias} />;

    if (succeededToSignUp)
      return <Success traderSignedUpTo={shortenAddress(affiliate)} />;

    // if (traderSignedUpTo)
    //   return <SignedUp traderSignedUpTo={traderSignedUpTo} />;

    return (
      <Form
        affiliate={affiliate}
        setAffiliate={setAffiliate}
        errorMessage={errorMessage}
        fetchingSignature={isLoading}
        postingSignature={false}
        traderAddress={traderAddress}
        handleSubmit={handleSubmit}
      />
    );
  };

  return (
    <Flex width={"100%"} height={"100%"} direction={"column"}>
      <Flex
        justify={{ initial: "center", sm: "start" }}
        align={"center"}
        width={"100%"}
        height={theme.headerSize.height}
        px={"10px"}
        gap={"8px"}
      >
        <Flex
          gap={"4px"}
          align={"center"}
          px={"4px"}
          style={{ color: theme.color.blue3, cursor: "pointer" }}
          onClick={() => handleBack()}
        >
          <ArrowLeftIcon />
          <Text size={"1"} weight={"medium"}>
            Back
          </Text>
        </Flex>

        <Text
          size={{ initial: "5", sm: "2" }}
          weight={{ initial: "bold", sm: "medium" }}
        >
          Referrals
        </Text>
      </Flex>
      <LineSeparator />

      <Flex
        justify={"center"}
        align={{ initial: "start", sm: "center" }}
        height={"100%"}
        pt={{ initial: "60px", sm: "0" }}
      >
        <GradientBorderBox>{renderContent()}</GradientBorderBox>
      </Flex>
    </Flex>
  );
};

export default SubmitReferralCode;
