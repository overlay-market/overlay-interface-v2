import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Copy, ExternalLink, Send, Wallet } from "lucide-react";
import { erc20Abi, formatUnits, isAddress, parseUnits } from "viem";
import { useAccount as useWagmiAccount, useSwitchChain, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import NumericalInput from "../../components/NumericalInput";
import Modal from "../../components/Modal";
import { useModalHelper } from "../../components/ConnectWalletModal/utils";
import { useAddPopup } from "../../state/application/hooks";
import { TransactionType } from "../../constants/transaction";
import { useCommunityPoolBalance, isCommunityPoolChainSupported } from "../../hooks/useCommunityPoolBalance";
import { useCommunityPools } from "../../hooks/useCommunityPools";
import { wagmiConfig } from "../../providers/Web3Provider/wagmi";
import { trackEvent } from "../../analytics/trackEvent";
import { CommunityPool, CommunityPoolStatus } from "../../types/communityPools";
import SubmitReferralCode from "../Referrals/SubmitReferralCode";
import {
  ActionButton,
  AmountBox,
  DetailLabel,
  DetailRow,
  DetailValue,
  Eyebrow,
  EmptyStateContent,
  EmptyStateText,
  EmptyStateTitle,
  ContributionForm,
  HelperText,
  HeroCopy,
  HeroPanel,
  HeroStat,
  HeroStatLabel,
  HeroStats,
  HeroStatValue,
  HeroSubtitle,
  HeroTitle,
  IconAction,
  InfoItem,
  InfoItemText,
  InfoItemTitle,
  InfoStrip,
  PageShell,
  PoolCard,
  PoolDetails,
  PoolIdentity,
  PoolLogo,
  PoolMarket,
  PoolName,
  PoolsGrid,
  PoolsHeader,
  PoolsMeta,
  PoolsTitle,
  PoolTop,
  ProgressBlock,
  ProgressFill,
  ProgressLabels,
  ProgressTrack,
  ReferralCodeButton,
  RoiHeader,
  RoiNote,
  RoiPanel,
  RoiScale,
  RoiScaleItem,
  RoiScaleValue,
  RoiScaleVolume,
  RoiSubtitle,
  RoiTitle,
  RequestFormLink,
  StatePanel,
  StatusBadge,
  TokenSymbol,
} from "./community-pools-styles";

const COMMUNITY_POOL_REQUEST_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdQr6GX8a5khZpxcB7Z6JDEvx1FsPoKQhF78D1qaVV6BslUig/viewform";

const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const explorerAddressUrl = (pool: CommunityPool, address: string) => {
  const baseUrl = pool.chain.explorerUrl.replace(/\/$/, "");
  return `${baseUrl}/address/${address}`;
};

const toRawAmount = (value: string, decimals: number): bigint | undefined => {
  if (!value || Number(value) <= 0) {
    return undefined;
  }

  try {
    return parseUnits(value, decimals);
  } catch {
    return undefined;
  }
};

const formatTokenAmount = (rawAmount: bigint, decimals: number, maxFractionDigits = 2) => {
  const value = Number(formatUnits(rawAmount, decimals));

  if (!Number.isFinite(value)) {
    return "0";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
};

const formatDate = (value?: string) => {
  if (!value) return "No deadline";

  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) return "No deadline";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(timestamp);
};

const getPoolStatus = (
  pool: CommunityPool,
  balanceRaw: bigint | undefined,
  targetRaw: bigint
): CommunityPoolStatus => {
  // A launched pool stays "launched" regardless of the current Safe balance —
  // once the market is live the pooled USDT is moved out of the Safe, which would
  // otherwise make the pool read as "expired"/"open" from the on-chain balance alone.
  if (pool.marketAddress) {
    return "launched";
  }

  const safeBalance = balanceRaw ?? 0n;

  if (targetRaw > 0n && safeBalance >= targetRaw) {
    return "funded";
  }

  if (pool.endsAt && new Date(pool.endsAt).getTime() < Date.now()) {
    return "expired";
  }

  return "open";
};

const getStatusLabel = (pool: CommunityPool, status: CommunityPoolStatus) => {
  if (pool.isDraft) return "Draft";
  if (status === "launched") return "Launched";
  if (status === "funded") return "Funded";
  if (status === "expired") return "Expired";
  return "Open";
};

const getStatusTone = (
  pool: CommunityPool,
  status: CommunityPoolStatus
): "open" | "funded" | "expired" | "draft" => {
  if (pool.isDraft) return "draft";
  if (status === "launched") return "open"; // green/positive tone (funded is amber, expired is red)
  return status;
};

const roiRows = [
  {
    volume: "$1M",
    monthlyRoi: "3%",
  },
  {
    volume: "$10M",
    monthlyRoi: "30%",
  },
  {
    volume: "$100M",
    monthlyRoi: "300%",
  },
];

const showDraftCommunityPools = import.meta.env.DEV;

type CommunityPoolItemProps = {
  pool: CommunityPool;
  referrer: string | null;
  referralStageCompleted: boolean;
  onReferralStageCompleted: () => void;
};

const CommunityPoolItem = ({
  pool,
  referrer,
  referralStageCompleted,
  onReferralStageCompleted,
}: CommunityPoolItemProps) => {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReferralSignup, setShowReferralSignup] = useState(false);
  const [affiliate, setAffiliate] = useState(referrer || "");
  const { address: walletAddress, chainId: walletChainId } = useWagmiAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { openModal } = useModalHelper();
  const addPopup = useAddPopup();
  const balanceQuery = useCommunityPoolBalance(pool);
  const isSupportedChain = isCommunityPoolChainSupported(pool.chain.chainId);

  useEffect(() => {
    setAffiliate(referrer || "");
  }, [referrer]);

  const targetRaw = useMemo(() => {
    try {
      return BigInt(pool.targetAmountRaw);
    } catch {
      return 0n;
    }
  }, [pool.targetAmountRaw]);

  const status = getPoolStatus(pool, balanceQuery.data, targetRaw);
  const balanceRaw = balanceQuery.data ?? 0n;
  const remainingRaw = balanceRaw >= targetRaw ? 0n : targetRaw - balanceRaw;
  const amountRaw = toRawAmount(amount, pool.contributionToken.decimals);
  const progressPercent =
    targetRaw > 0n
      ? Number((balanceRaw * 10_000n) / targetRaw) / 100
      : 0;
  const wrongChain = Boolean(walletAddress && walletChainId !== pool.chain.chainId);
  const invalidAmount = Boolean(amount && (!amountRaw || amountRaw > remainingRaw));
  const canContribute =
    Boolean(walletAddress) &&
    isSupportedChain &&
    !wrongChain &&
    !pool.isDraft &&
    status === "open" &&
    Boolean(amountRaw) &&
    !invalidAmount &&
    !isSubmitting;

  const helperText = useMemo(() => {
    if (pool.isDraft) return "Draft pool: transactions are disabled.";
    if (!isSupportedChain) return `${pool.chain.chainName} is not configured in this wallet session.`;
    if (balanceQuery.isError) return "Unable to read the Safe balance.";
    if (status === "launched") return "Market launched — this pool is live.";
    if (status === "funded") return "Target reached. Contributions are closed.";
    if (status === "expired") return "Countdown ended before the target was reached.";
    if (invalidAmount) return amountRaw ? "Amount exceeds the remaining pool target." : "Enter a valid amount.";
    return `${formatTokenAmount(remainingRaw, pool.contributionToken.decimals)} ${pool.contributionToken.symbol} remaining`;
  }, [
    amountRaw,
    balanceQuery.isError,
    invalidAmount,
    isSupportedChain,
    pool.chain.chainName,
    pool.contributionToken.decimals,
    pool.contributionToken.symbol,
    pool.isDraft,
    remainingRaw,
    status,
  ]);

  const buttonLabel = useMemo(() => {
    if (pool.isDraft) return "Draft Pool";
    if (!isSupportedChain) return "Unsupported Chain";
    if (status === "launched") return "Launched";
    if (status === "funded") return "Funded";
    if (status === "expired") return "Expired";
    if (!walletAddress) return "Connect Wallet";
    if (wrongChain) return `Switch to ${pool.chain.chainName}`;
    if (isSubmitting) return "Confirming";
    return "Chip In";
  }, [
    isSubmitting,
    isSupportedChain,
    pool.chain.chainName,
    pool.isDraft,
    status,
    walletAddress,
    wrongChain,
  ]);

  const handleCopySafe = async () => {
    await navigator.clipboard.writeText(pool.safeAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const executeContribution = async () => {
    if (!amountRaw) {
      return;
    }

    setIsSubmitting(true);

    try {
      const hash = await writeContractAsync({
        chainId: pool.chain.chainId,
        address: pool.contributionToken.address,
        abi: erc20Abi,
        functionName: "transfer",
        args: [pool.safeAddress, amountRaw],
      });

      addPopup(
        {
          txn: {
            hash,
            success: null,
            message: `Sending ${amount} ${pool.contributionToken.symbol}`,
            type: TransactionType.COMMUNITY_POOL_CONTRIBUTION,
          },
        },
        hash,
        null
      );

      await waitForTransactionReceipt(wagmiConfig, {
        chainId: pool.chain.chainId,
        hash,
        confirmations: 1,
      });

      addPopup(
        {
          txn: {
            hash,
            success: true,
            message: "",
            type: TransactionType.COMMUNITY_POOL_CONTRIBUTION,
          },
        },
        hash
      );

      trackEvent("community_pool_contribution_success", {
        wallet_address: walletAddress,
        pool_slug: pool.slug,
        market_name: pool.marketName,
        amount,
        token_symbol: pool.contributionToken.symbol,
        chain_id: pool.chain.chainId,
        transaction_hash: `hash_${hash}`,
        timestamp: new Date().toISOString(),
      });

      setAmount("");
      await balanceQuery.refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message.split("\n")[0]
          : "Contribution failed";

      addPopup(
        {
          txn: {
            hash: Date.now().toString(),
            success: false,
            message,
            type: "COMMUNITY_POOL_CONTRIBUTION_FAILED",
          },
        },
        Date.now().toString()
      );

      trackEvent("community_pool_contribution_failed", {
        wallet_address: walletAddress,
        pool_slug: pool.slug,
        market_name: pool.marketName,
        amount,
        token_symbol: pool.contributionToken.symbol,
        chain_id: pool.chain.chainId,
        error_message: message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReferralSignupClose = () => {
    setShowReferralSignup(false);
    setAffiliate(referrer || "");
  };

  const handleReferralSignupSuccess = async () => {
    setShowReferralSignup(false);
    onReferralStageCompleted();
    await executeContribution();
  };

  const handleAction = async () => {
    if (pool.isDraft || !isSupportedChain || status !== "open") {
      return;
    }

    if (!walletAddress) {
      openModal();
      return;
    }

    if (wrongChain) {
      await switchChainAsync({ chainId: pool.chain.chainId });
      return;
    }

    if (!canContribute || !amountRaw) {
      return;
    }

    if (referrer && !referralStageCompleted) {
      setAffiliate(referrer);
      setShowReferralSignup(true);
      return;
    }

    await executeContribution();
  };

  return (
    <>
      <Modal
        triggerElement={null}
        open={showReferralSignup}
        handleClose={handleReferralSignupClose}
        width="472px"
        maxWidth="calc(100vw - 32px)"
        title=""
      >
        <SubmitReferralCode
          affiliate={affiliate}
          setAffiliate={setAffiliate}
          handleBack={handleReferralSignupClose}
          onSuccess={handleReferralSignupSuccess}
          title="Submit your referral code"
          embedded
        />
      </Modal>

      <PoolCard>
      <PoolTop>
        <PoolLogo $image={pool.logoUrl}>
          {!pool.logoUrl && pool.tokenSymbol.slice(0, 3).toUpperCase()}
        </PoolLogo>
        <PoolIdentity>
          <PoolName>{pool.tokenSymbol} Pool</PoolName>
          <PoolMarket>{pool.marketName}</PoolMarket>
        </PoolIdentity>
        <StatusBadge $tone={getStatusTone(pool, status)}>
          {getStatusLabel(pool, status)}
        </StatusBadge>
      </PoolTop>

      <ProgressBlock>
        <ProgressLabels>
          <span>
            {balanceQuery.isLoading
              ? "Loading"
              : `${formatTokenAmount(balanceRaw, pool.contributionToken.decimals)} ${pool.contributionToken.symbol}`}
          </span>
          <span>
            {formatTokenAmount(targetRaw, pool.contributionToken.decimals)} {pool.contributionToken.symbol}
          </span>
        </ProgressLabels>
        <ProgressTrack>
          <ProgressFill $percent={progressPercent} />
        </ProgressTrack>
      </ProgressBlock>

      <PoolDetails>
        <DetailRow>
          <DetailLabel>Chain</DetailLabel>
          <DetailValue>{pool.chain.chainName}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Safe</DetailLabel>
          <DetailValue>
            {shortenAddress(pool.safeAddress)}
            <IconAction type="button" onClick={handleCopySafe} aria-label="Copy Safe address">
              <Copy size={14} />
            </IconAction>
            <IconAction
              as="a"
              href={explorerAddressUrl(pool, pool.safeAddress)}
              target="_blank"
              rel="noreferrer"
              aria-label="Open Safe on explorer"
            >
              <ExternalLink size={14} />
            </IconAction>
          </DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Deadline</DetailLabel>
          <DetailValue>{formatDate(pool.endsAt)}</DetailValue>
        </DetailRow>
      </PoolDetails>

      <ContributionForm>
        <AmountBox>
          <NumericalInput
            value={amount}
            handleUserInput={setAmount}
            placeholder="0.0"
            disabled={pool.isDraft || status !== "open" || !isSupportedChain}
          />
          <TokenSymbol>{pool.contributionToken.symbol}</TokenSymbol>
        </AmountBox>
        <ActionButton
          type="button"
          onClick={handleAction}
          disabled={
            pool.isDraft ||
            !isSupportedChain ||
            status !== "open" ||
            (Boolean(walletAddress) && !wrongChain && !canContribute)
          }
          $variant={!walletAddress || wrongChain ? "outline" : "solid"}
        >
          {!walletAddress ? <Wallet size={16} /> : <Send size={16} />}
          {buttonLabel}
        </ActionButton>
        <HelperText $tone={invalidAmount || balanceQuery.isError ? "error" : "muted"}>
          {copied ? "Safe address copied." : helperText}
        </HelperText>
      </ContributionForm>
      </PoolCard>
    </>
  );
};

const CommunityPools = () => {
  const { data: pools = [], isLoading, isError, error, refetch } = useCommunityPools();
  const [searchParams, setSearchParams] = useSearchParams();
  const referrer = searchParams.get("referrer");
  const [referralStageCompleted, setReferralStageCompleted] = useState(false);
  const [showReferralCodeModal, setShowReferralCodeModal] = useState(false);
  const [manualReferralAffiliate, setManualReferralAffiliate] = useState(referrer || "");
  const visiblePools = pools.filter(
    (pool) =>
      isAddress(pool.safeAddress) &&
      isAddress(pool.contributionToken.address) &&
      (showDraftCommunityPools || !pool.isDraft)
  );
  const poolsMetaLabel = visiblePools.length > 0
    ? `${visiblePools.length} listed`
    : "0 listed";

  useEffect(() => {
    setReferralStageCompleted(false);
    setManualReferralAffiliate(referrer || "");
  }, [referrer]);

  const handleReferralStageCompleted = () => {
    setReferralStageCompleted(true);
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("referrer");
    setSearchParams(nextSearchParams, { replace: true });
  };

  const handleOpenReferralCodeModal = () => {
    setManualReferralAffiliate(referrer || "");
    setShowReferralCodeModal(true);
  };

  const handleCloseReferralCodeModal = () => {
    setShowReferralCodeModal(false);
    setManualReferralAffiliate(referrer || "");
  };

  const handleManualReferralSuccess = () => {
    setShowReferralCodeModal(false);
    handleReferralStageCompleted();
  };

  return (
    <PageShell>
      <Modal
        triggerElement={null}
        open={showReferralCodeModal}
        handleClose={handleCloseReferralCodeModal}
        width="472px"
        maxWidth="calc(100vw - 32px)"
        title=""
      >
        <SubmitReferralCode
          affiliate={manualReferralAffiliate}
          setAffiliate={setManualReferralAffiliate}
          handleBack={handleCloseReferralCodeModal}
          onSuccess={handleManualReferralSuccess}
          title="Submit your referral code"
          embedded
        />
      </Modal>

      <HeroPanel>
        <HeroCopy>
          <Eyebrow>Community-funded listings</Eyebrow>
          <HeroTitle>Community Pools</HeroTitle>
          <HeroSubtitle>
            Fund a token&apos;s perps market together. When a pool reaches its target,
            Overlay launches the market with a 0.1% trading fee and contributors
            share 30% of those fees pro-rata.
          </HeroSubtitle>
          <ReferralCodeButton type="button" onClick={handleOpenReferralCodeModal}>
            I have a referral code
          </ReferralCodeButton>
        </HeroCopy>
        <HeroStats>
          <HeroStat>
            <HeroStatLabel>Pool Target</HeroStatLabel>
            <HeroStatValue>$10K</HeroStatValue>
          </HeroStat>
          <HeroStat>
            <HeroStatLabel>Fee Share</HeroStatLabel>
            <HeroStatValue>30%</HeroStatValue>
          </HeroStat>
          <HeroStat>
            <HeroStatLabel>Minimum</HeroStatLabel>
            <HeroStatValue>$0</HeroStatValue>
          </HeroStat>
        </HeroStats>
      </HeroPanel>

      <InfoStrip>
        <InfoItem>
          <InfoItemTitle>Pool fills</InfoItemTitle>
          <InfoItemText>Community members contribute any amount toward the target.</InfoItemText>
        </InfoItem>
        <InfoItem>
          <InfoItemTitle>Market launches</InfoItemTitle>
          <InfoItemText>Overlay deploys the perps market after funding is complete.</InfoItemText>
        </InfoItem>
        <InfoItem>
          <InfoItemTitle>Fees accrue</InfoItemTitle>
          <InfoItemText>
            Each market charges a 0.1% trading fee; contributors receive weekly
            pro-rata payouts from 30% of that fee stream.
          </InfoItemText>
        </InfoItem>
        <InfoItem>
          <InfoItemTitle>Countdown ends</InfoItemTitle>
          <InfoItemText>Unfilled pools become refundable after the pool window closes.</InfoItemText>
        </InfoItem>
      </InfoStrip>

      <RoiPanel>
        <RoiHeader>
          <RoiTitle>Monthly ROI reach</RoiTitle>
          <RoiSubtitle>
            Based on a $10K pool, 0.1% trading fee, and 30% contributor share.
          </RoiSubtitle>
        </RoiHeader>
        <RoiScale>
          {roiRows.map((row) => (
            <RoiScaleItem key={row.volume}>
              <RoiScaleVolume>{row.volume} volume</RoiScaleVolume>
              <RoiScaleValue>{row.monthlyRoi} monthly ROI</RoiScaleValue>
            </RoiScaleItem>
          ))}
        </RoiScale>
        <RoiNote>
          Volume is the total trade size counted at both entry and unwind over
          the month.
        </RoiNote>
      </RoiPanel>

      <PoolsHeader>
        <PoolsTitle>Active Pools</PoolsTitle>
        <PoolsMeta>{poolsMetaLabel}</PoolsMeta>
      </PoolsHeader>

      {isLoading ? (
        <StatePanel>Loading community pools...</StatePanel>
      ) : isError ? (
        <StatePanel>
          <div>
            <div>Unable to load community pools.</div>
            <ActionButton type="button" onClick={() => refetch()} style={{ marginTop: 14 }}>
              Retry
            </ActionButton>
            <HelperText $tone="error">
              {error instanceof Error ? error.message : "Unknown error"}
            </HelperText>
          </div>
        </StatePanel>
      ) : visiblePools.length === 0 ? (
        <StatePanel>
          {showDraftCommunityPools ? (
            "No community pools are currently listed."
          ) : (
            <EmptyStateContent>
              <EmptyStateTitle>No active community pools.</EmptyStateTitle>
              <EmptyStateText>
                Want to launch a market through a community-funded pool?
              </EmptyStateText>
              <RequestFormLink
                href={COMMUNITY_POOL_REQUEST_FORM_URL}
                target="_blank"
                rel="noreferrer"
              >
                Request a market community pool
                <ExternalLink size={14} />
              </RequestFormLink>
            </EmptyStateContent>
          )}
        </StatePanel>
      ) : (
        <PoolsGrid>
          {visiblePools.map((pool) => (
            <CommunityPoolItem
              key={pool.slug}
              pool={pool}
              referrer={referrer}
              referralStageCompleted={referralStageCompleted}
              onReferralStageCompleted={handleReferralStageCompleted}
            />
          ))}
        </PoolsGrid>
      )}
    </PageShell>
  );
};

export default CommunityPools;
