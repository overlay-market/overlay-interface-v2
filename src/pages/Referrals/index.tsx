import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ReferralsGeneral } from "./ReferralsGeneral";
import SubmitReferralCode from "./SubmitReferralCode";
import useAccount from "../../hooks/useAccount";

const Referrals: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAvatarTradingActive } = useAccount();
  const referrer = searchParams.get("referrer");

  const [showSubmitReferralCodeForm, setShowSubmitReferralCodeForm] =
    useState(false);
  const [affiliate, setAffiliate] = useState(referrer || "");

  useEffect(() => {
    if (referrer && !isAvatarTradingActive) {
      setShowSubmitReferralCodeForm(true);
    }
  }, [referrer, isAvatarTradingActive]);

  const handleBack = () => {
    setAffiliate("");
    setShowSubmitReferralCodeForm(false);
    setSearchParams({});
  };

  return (
    <>
      {showSubmitReferralCodeForm && (
        <SubmitReferralCode
          affiliate={affiliate}
          setAffiliate={setAffiliate}
          handleBack={handleBack}
        />
      )}
      {!showSubmitReferralCodeForm && (
        <ReferralsGeneral
          setShowSubmitReferralCodeForm={setShowSubmitReferralCodeForm}
        />
      )}
    </>
  );
};

export default Referrals;
