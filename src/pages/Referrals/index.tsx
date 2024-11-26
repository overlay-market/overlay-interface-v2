import { useEffect, useState } from 'react';
import { GradientSolidButton } from '../../components/Button';
import Loader from '../../components/Loader';
import { useAccount, useSignTypedData } from 'wagmi';
import { useOpenWalletModal } from '../../components/ConnectWalletModal/utils';
import { shortenAddress } from '../../utils/web3';
import { isAddress } from 'viem'

const Referrals = () => {
  const { address: traderAddress } = useAccount();
  const { signTypedDataAsync } = useSignTypedData()
  const [loading, setLoading] = useState(false);
  const [fetchingSignature, setFetchingSignature] = useState(false);
  const [affiliateAddress, setAffiliateAddress] = useState('');
  const [traderSignedUpTo, setTraderSignedUpTo] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [succeededToSignUp, setSucceededToSignUp] = useState(false);

  const referralApiBaseUrl = "https://api.overlay.market/referral";

  // Check trader status
  const checkTraderStatus = async (address: string) => {
    setLoading(true);
    try {
      const response = await fetch(referralApiBaseUrl + `/signatures/check/${address}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch trader status: ${response.statusText}`);
      }
      const { affiliate }: {exists: boolean, affiliate: string} = await response.json();
      setTraderSignedUpTo(affiliate)
    } catch (error) {
      console.error('Error checking trader status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (traderAddress) {
      checkTraderStatus(traderAddress);
    }
  }, [traderAddress]);

  const postSignature = async (signature: string, affiliate: string) => {
    if (!traderAddress) {
      console.error('Trader address is missing');
    }
  
    setLoading(true);
    try {
      const response = await fetch(referralApiBaseUrl + `/signatures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trader: traderAddress,
          affiliate,
          signature,
        }),
      });
  
      if (!response.ok) {
        const result = await response.json();
        setErrorMessage(`Failed to post signature: ${result?.message ?? "Unable to get error message"}`)
        throw new Error(`Failed to post signature: ${JSON.stringify(result)}`);
      }
  
      const result = await response.json();
      if (result.createdAt) {
        console.log('submitted')
        setSucceededToSignUp(true)
        // TODO create toast notification
      }
    } catch (error) {
      console.error('Error posting signature:', error);
    } finally {
      setLoading(false);
    }
  };  

  // EIP 712 signature data
  const domain = {
    name: "Overlay Referrals",
    version: "1.0",
  }
  const types = {
    AffiliateTo: [{ name: "affiliate", type: "address" }],
  }
  const primaryType = "AffiliateTo"

  const fetchSignature = async (affiliate: string) => {
    setFetchingSignature(true);
    let signature
    try {
      signature = await signTypedDataAsync({
        domain,
        types,
        primaryType,
        message: {affiliate},
      })
    } catch (error) {
      const errorWithDetails = error as { details?: string }
      if (errorWithDetails?.details) {
        setErrorMessage(`${errorWithDetails.details}`)
      } else {
        setErrorMessage("unable to get error, see console")
      }
      console.error('Error fetching signature:', error);
    } finally {
      setFetchingSignature(false);
    }
    return signature
  };

  const handleSubmit = async () => {
    setErrorMessage(null)
    if (!affiliateAddress || !traderAddress) return;
    if (!isAddress(affiliateAddress)) {
      setErrorMessage('Enter a valid address')
      return
    }
    const signature = await fetchSignature(affiliateAddress);
    console.log({signature})
    signature && await postSignature(signature, affiliateAddress);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Referrals</h1>
      {traderSignedUpTo && (
        <p style={{ color: 'red' }}>
          You are already signed up for the referral program to {shortenAddress(traderSignedUpTo)}
        </p>
      )}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Affiliate Address:
          <input
            type="text"
            value={affiliateAddress}
            onChange={(e) => setAffiliateAddress(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
        {errorMessage && (
          <p style={{ color: 'red' }}>
            {errorMessage}
          </p>
        )}
      </div>
      {!succeededToSignUp &&
        (!traderAddress
          ? <GradientSolidButton
              title="Connect Wallet"
              width='300px'
              handleClick={useOpenWalletModal}
            />
          : traderSignedUpTo !== ''
            ? <GradientSolidButton
                title={`Already Signed Up`}
                isDisabled={true}
                width="300px"
              />
            : affiliateAddress === ''
              ? <GradientSolidButton
                  title="Enter Affiliate Address"
                  isDisabled={true}
                  width='300px'
                />
              : <GradientSolidButton
                  title="Submit"
                  width='300px'
                  isDisabled={fetchingSignature}
                  handleClick={handleSubmit}
                />
          )
      }
      {succeededToSignUp &&
        <GradientSolidButton
          title="🎉 Success 🎉"
          isDisabled={true}
          width='300px'
        />
      }
      {(loading || fetchingSignature) && <Loader />}
    </div>
  );
};

export default Referrals;
