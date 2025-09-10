import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { shortenAddress } from "../../utils/web3";
import { isAddress } from "viem";
import { useSearchParams } from "react-router-dom";
import { Flex, Text } from "@radix-ui/themes";
import {
  ContentContainer,
  GradientBorderBox,
  LineSeparator,
} from "./referrals-styles";
import theme from "../../theme";
import Loader from "../../components/Loader";
import AliasSubmit from "./AliasSubmit";
import { useAffiliateAlias } from "../../hooks/referrals/useAffiliateAlias";
import { useTraderStatus } from "../../hooks/referrals/useTraderStatus";
import { useAffiliateAddress } from "../../hooks/referrals/useAffiliateAddress";
import { usePostSignature } from "../../hooks/referrals/usePostSignature";
import { Success } from "./Success";
import { SignedUp } from "./SignedUp";
import { Form } from "./Form";
import { useSignature } from "../../hooks/referrals/useSignature";

const Referrals: React.FC = () => {
  const [searchParams] = useSearchParams();
  const referralAddressFromURL = searchParams.get("referrer");

  const { address: traderAddress, status } = useAccount();

  const [affiliate, setAffiliate] = useState(referralAddressFromURL || "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [succeededToSignUp, setSucceededToSignUp] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

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

  const { data: affiliateAliasData, isLoading: loadingAffiliate } =
    useAffiliateAlias(traderAddress);

  const { data: traderStatusData, isLoading: loadingTrader } = useTraderStatus(
    traderAddress && !affiliateAliasData?.isValid ? traderAddress : undefined
  );

  const { data: affiliateAddressData } = useAffiliateAddress(
    !isAddress(affiliate) ? affiliate : undefined
  );

  const {
    data: aliasOfSignedUpAffiliate,
    isLoading: loadingAliasOfSignedUpAffiliate,
  } = useAffiliateAlias(traderStatusData?.affiliate);

  const { fetchSignature, fetchingSignature, signatureError } = useSignature();
  const postSignature = usePostSignature();

  const traderSignedUpTo = useMemo(() => {
    const affiliateAddr = traderStatusData?.affiliate;
    if (!affiliateAddr) return "";
    return aliasOfSignedUpAffiliate?.alias ?? shortenAddress(affiliateAddr, 7);
  }, [traderStatusData, aliasOfSignedUpAffiliate]);

  const handleSubmit = async () => {
    setErrorMessage(null);
    if (!affiliate || !traderAddress) return;

    let affiliateAddress: string | null = null;
    let isAffiliateValid = true;

    if (isAddress(affiliate)) {
      affiliateAddress = affiliate;
      if (!affiliateAliasData?.isValid) {
        setErrorMessage("Affiliate not found");
        isAffiliateValid = false;
      }
    } else {
      affiliateAddress = affiliateAddressData?.address ?? null;
      if (!affiliateAddress) setErrorMessage("Invalid affiliate");
    }

    if (!affiliateAddress || !isAffiliateValid) return;

    try {
      const signature = await fetchSignature(affiliateAddress);

      if (!signature) {
        setErrorMessage(signatureError ?? "Failed to sign message");
        return;
      }

      await postSignature.mutateAsync({
        trader: traderAddress,
        affiliate: affiliateAddress,
        signature,
      });
      setSucceededToSignUp(true);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const isLoading =
    isInitialLoading ||
    loadingAffiliate ||
    loadingTrader ||
    loadingAliasOfSignedUpAffiliate;

  const renderContent = () => {
    if (affiliateAliasData?.isValid)
      return <AliasSubmit alias={affiliateAliasData.alias} />;

    if (succeededToSignUp)
      return <Success traderSignedUpTo={traderSignedUpTo} />;

    if (traderSignedUpTo)
      return <SignedUp traderSignedUpTo={traderSignedUpTo} />;

    return (
      <Form
        affiliate={affiliate}
        setAffiliate={setAffiliate}
        errorMessage={errorMessage}
        fetchingSignature={fetchingSignature}
        postingSignature={postSignature.isPending}
        traderAddress={traderAddress}
        handleSubmit={handleSubmit}
      />
    );
  };

  return (
    <Flex width={"100%"} height={"100%"} direction={"column"}>
      <Flex
        justify={{ initial: "center", sm: "start" }}
        align={{ initial: "end", sm: "center" }}
        width={"100%"}
        height={theme.headerSize.height}
        px={"10px"}
      >
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
        {isLoading ? (
          <ContentContainer
            align={"center"}
            justify={"center"}
            height={"224px"}
          >
            <Loader />
          </ContentContainer>
        ) : (
          <GradientBorderBox>{renderContent()}</GradientBorderBox>
        )}
      </Flex>
    </Flex>
  );
};

export default Referrals;
