import { FormEvent, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Info,
  Search,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import {
  TeamMemberVerificationType,
  useTeamMemberVerification,
} from "../../hooks/useTeamMemberVerification";
import theme from "../../theme";
import {
  DetailLabel,
  DetailList,
  DetailRow,
  DetailValue,
  Eyebrow,
  HeroSection,
  Notice,
  NoticeStack,
  PageShell,
  PanelCopy,
  PanelHeader,
  PanelTitle,
  ProfileLink,
  QueryInput,
  ResultCopy,
  ResultPanel,
  ResultStatus,
  ResultTitle,
  SafetyCopy,
  SafetySection,
  SafetyTitle,
  SearchButton,
  SearchRow,
  Subtitle,
  Title,
  ToolPanel,
  TypeSelect,
  VerificationGrid,
} from "./team-member-verification-styles";

type VerificationSelectValue = TeamMemberVerificationType | "auto";
type ResultState = "idle" | "verified" | "unverified";

const VERIFICATION_TYPES: Array<{
  value: VerificationSelectValue;
  label: string;
  placeholder: string;
}> = [
  {
    value: "auto",
    label: "Auto detect",
    placeholder: "URL, email, handle, wallet, or phone",
  },
  {
    value: "telegram",
    label: "Telegram",
    placeholder: "@overlay_member or t.me/overlay_member",
  },
  {
    value: "x",
    label: "X / Twitter",
    placeholder: "@overlay_member or x.com/overlay_member",
  },
  {
    value: "email",
    label: "Email",
    placeholder: "name@overlay.market",
  },
  {
    value: "discord",
    label: "Discord",
    placeholder: "overlay_member",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    placeholder: "linkedin.com/in/overlay-member",
  },
  {
    value: "url",
    label: "URL",
    placeholder: "https://overlay.market/team",
  },
  {
    value: "wallet",
    label: "Wallet",
    placeholder: "0x...",
  },
  {
    value: "phone",
    label: "Phone",
    placeholder: "+1 555 010 1234",
  },
  {
    value: "other",
    label: "Other",
    placeholder: "Official identifier",
  },
];

const TYPE_LABELS: Record<TeamMemberVerificationType, string> = {
  email: "Email",
  telegram: "Telegram",
  x: "X / Twitter",
  discord: "Discord",
  linkedin: "LinkedIn",
  url: "URL",
  wallet: "Wallet",
  phone: "Phone",
  other: "Other",
};

const TeamMemberVerification: React.FC = () => {
  const [verificationType, setVerificationType] =
    useState<VerificationSelectValue>("auto");
  const [query, setQuery] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const verification = useTeamMemberVerification();

  const selectedType = useMemo(
    () =>
      VERIFICATION_TYPES.find((type) => type.value === verificationType) ??
      VERIFICATION_TYPES[0],
    [verificationType]
  );

  const resultState: ResultState = verification.data
    ? verification.data.verified
      ? "verified"
      : "unverified"
    : "idle";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setLocalError("Enter an identity to verify.");
      return;
    }

    setLocalError(null);
    verification.reset();
    await verification.mutateAsync({
      value: trimmedQuery,
      type: verificationType === "auto" ? undefined : verificationType,
    });
  };

  const renderResult = () => {
    const record = verification.data?.result;

    if (verification.isPending) {
      return (
        <>
          <ResultStatus $state="idle">
            <Search size={14} />
            Checking
          </ResultStatus>
          <ResultTitle>Verification in progress</ResultTitle>
          <ResultCopy>Matching this identity against the Overlay verification registry.</ResultCopy>
        </>
      );
    }

    if (record) {
      return (
        <>
          <ResultStatus $state="verified">
            <CheckCircle2 size={14} />
            Verified
          </ResultStatus>
          <ResultTitle>Official Overlay team member</ResultTitle>
          <ResultCopy>
            This identity is listed in the Overlay team verification registry.
          </ResultCopy>
          <DetailList>
            <DetailRow>
              <DetailLabel>Team member</DetailLabel>
              <DetailValue>{record.memberName}</DetailValue>
            </DetailRow>
            {record.role && (
              <DetailRow>
                <DetailLabel>Role</DetailLabel>
                <DetailValue>{record.role}</DetailValue>
              </DetailRow>
            )}
            <DetailRow>
              <DetailLabel>{record.contactLabel || TYPE_LABELS[record.type]}</DetailLabel>
              <DetailValue>{record.value}</DetailValue>
            </DetailRow>
            {record.notes && (
              <DetailRow>
                <DetailLabel>Note</DetailLabel>
                <DetailValue>{record.notes}</DetailValue>
              </DetailRow>
            )}
          </DetailList>
          {record.profileUrl && (
            <ProfileLink href={record.profileUrl} target="_blank" rel="noopener noreferrer">
              View profile <ExternalLink size={14} />
            </ProfileLink>
          )}
        </>
      );
    }

    if (verification.data && !verification.data.verified) {
      return (
        <>
          <ResultStatus $state="unverified">
            <AlertTriangle size={14} />
            Not verified
          </ResultStatus>
          <ResultTitle>No official match</ResultTitle>
          <ResultCopy>
            This identity is not currently listed as an official Overlay team
            member contact. Treat requests from it as unverified.
          </ResultCopy>
          <DetailList>
            <DetailRow>
              <DetailLabel>Submitted identity</DetailLabel>
              <DetailValue>{verification.data.query.value}</DetailValue>
            </DetailRow>
          </DetailList>
        </>
      );
    }

    return (
      <>
        <ResultStatus $state="idle">
          <ShieldQuestion size={14} />
          Awaiting search
        </ResultStatus>
        <ResultTitle>Verify before you trust</ResultTitle>
        <ResultCopy>
          Search the registry for an Overlay team member identity before
          responding to private outreach.
        </ResultCopy>
      </>
    );
  };

  return (
    <PageShell>
      <HeroSection>
        <Eyebrow>Overlay Verify</Eyebrow>
        <Title>Team member verification</Title>
        <Subtitle>
          Check whether a URL, email address, wallet, phone number, Telegram,
          Discord, X, or LinkedIn account is officially associated with an
          Overlay team member.
        </Subtitle>
      </HeroSection>

      <VerificationGrid>
        <ToolPanel onSubmit={handleSubmit}>
          <PanelHeader>
            <PanelTitle>Identity lookup</PanelTitle>
            <PanelCopy>
              Overlay Verify only assists identity verification. Verification
              does not grant authorization for any actions or listings. Overlay
              will never request funds or tokens via private communications.
            </PanelCopy>
          </PanelHeader>

          <SearchRow>
            <TypeSelect
              value={verificationType}
              onChange={(event) =>
                setVerificationType(event.target.value as VerificationSelectValue)
              }
              aria-label="Verification type"
            >
              {VERIFICATION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </TypeSelect>
            <QueryInput
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (localError) setLocalError(null);
              }}
              placeholder={selectedType.placeholder}
              aria-label="Identity to verify"
            />
            <SearchButton
              type="submit"
              disabled={verification.isPending}
            >
              {verification.isPending ? (
                <ShieldCheck size={17} />
              ) : (
                <Search size={17} />
              )}
              Search
            </SearchButton>
          </SearchRow>

          <NoticeStack>
            {localError && (
              <Notice style={{ color: theme.semantic.negative }}>
                <AlertTriangle size={16} />
                {localError}
              </Notice>
            )}
            {verification.isError && (
              <Notice style={{ color: theme.semantic.negative }}>
                <AlertTriangle size={16} />
                Unable to complete verification. Try again shortly.
              </Notice>
            )}
            <Notice>
              <Info size={16} />
              Overlay Verify only assists identity verification. Verification
              does not grant authorization for any actions or listings. Overlay
              will never request funds or tokens via private communications.
            </Notice>
          </NoticeStack>
        </ToolPanel>

        <ResultPanel $state={resultState}>{renderResult()}</ResultPanel>
      </VerificationGrid>

      <SafetySection>
        <SafetyTitle>Stay Safe!</SafetyTitle>
        <SafetyCopy>
          Always verify the exact identity before responding to outreach. If a
          message requests funds, tokens, private keys, seed phrases, or wallet
          access, treat it as unverified and do not proceed.
        </SafetyCopy>
      </SafetySection>
    </PageShell>
  );
};

export default TeamMemberVerification;
