import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ReferralsGeneral } from "./ReferralsGeneral";
import SubmitReferralCode from "./SubmitReferralCode";

const Referrals: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const referrer = searchParams.get("referrer");

  const [showSubmitReferralCodeForm, setShowSubmitReferralCodeForm] =
    useState(false);
  const [affiliate, setAffiliate] = useState(referrer || "");

  useEffect(() => {
    if (referrer) {
      setShowSubmitReferralCodeForm(true);
    }
  }, [referrer]);

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
