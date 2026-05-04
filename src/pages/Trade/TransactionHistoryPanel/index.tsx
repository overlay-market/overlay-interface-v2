import { Text } from "@radix-ui/themes";
import { gql, request } from "graphql-request";
import { useEffect, useMemo, useState } from "react";
import { formatUnits } from "viem";
import styled from "styled-components";
import StyledTable, { StyledCell, StyledRow } from "../../../components/Table";
import Loader from "../../../components/Loader";
import { CHAIN_SUBGRAPH_URL } from "../../../constants/subgraph";
import useAccount from "../../../hooks/useAccount";
import useActiveMarkets from "../../../hooks/useActiveMarkets";
import { useOvlPrice } from "../../../hooks/useOvlPrice";
import useSDK from "../../../providers/SDKProvider/useSDK";
import theme from "../../../theme";
import { ExplorerDataType, getExplorerLink } from "../../../utils/getExplorerLink";
import {
  formatNumberWithCommas,
  formatPriceWithCurrency,
} from "../../../utils/formatPriceWithCurrency";

const WALLET_TRANSACTION_HISTORY_QUERY = gql`
  query WalletTransactionHistory($account: ID!, $first: Int!) {
    account(id: $account) {
      builds(orderBy: timestamp, orderDirection: desc, first: $first) {
        id
        timestamp
        price
        position {
          initialNotional
          isLong
          market {
            id
          }
        }
        transaction {
          id
        }
      }
      unwinds(orderBy: timestamp, orderDirection: desc, first: $first) {
        id
        timestamp
        price
        size
        position {
          isLong
          market {
            id
          }
        }
        transaction {
          id
        }
      }
    }
  }
`;

const TRANSACTION_COLUMNS = [
  "Time",
  "Type",
  "Market",
  "Side",
  "Price",
  "Amount (USD)",
  "Txn",
];

type TransactionType = "build" | "unwind";

type BuildEvent = {
  id: string;
  timestamp: string;
  price: string;
  position?: {
    initialNotional?: string;
    isLong?: boolean;
    market?: {
      id?: string;
    } | null;
  } | null;
  transaction?: {
    id?: string;
  } | null;
};

type UnwindEvent = {
  id: string;
  timestamp: string;
  price: string;
  size: string;
  position?: {
    isLong?: boolean;
    market?: {
      id?: string;
    } | null;
  } | null;
  transaction?: {
    id?: string;
  } | null;
};

type WalletTransactionHistoryResponse = {
  account?: {
    builds: BuildEvent[];
    unwinds: UnwindEvent[];
  } | null;
};

type TransactionEntry = {
  id: string;
  type: TransactionType;
  timestamp: number;
  price: string;
  amountOvl: string;
  isLong?: boolean;
  marketAddress?: string;
  transactionHash?: string;
};

const formatTime = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

const shortenHash = (hash?: string) =>
  hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : "-";

const formatWeiPrice = (price: string, priceCurrency: string) => {
  try {
    return formatPriceWithCurrency(formatUnits(BigInt(price), 18), priceCurrency);
  } catch {
    return "-";
  }
};

const formatUsdAmount = (amountOvl: string, ovlPrice?: number) => {
  if (!ovlPrice) return "-";

  try {
    const amount = Number(formatUnits(BigInt(amountOvl), 18)) * ovlPrice;
    if (!Number.isFinite(amount)) return "-";
    return `$${formatNumberWithCommas(amount)}`;
  } catch {
    return "-";
  }
};

const TransactionHistoryPanel: React.FC = () => {
  const sdk = useSDK();
  const chainId = sdk.core.chainId;
  const { address } = useAccount();
  const { data: ovlPrice } = useOvlPrice();
  const { data: markets } = useActiveMarkets();
  const subgraphUrl = CHAIN_SUBGRAPH_URL[chainId];
  const account = address?.toLowerCase();
  const [entries, setEntries] = useState<TransactionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const marketLookup = useMemo(() => {
    const lookup = new Map<string, { name: string; priceCurrency: string }>();

    markets?.forEach((market) => {
      const key = market.id?.toLowerCase();
      if (!key) return;
      lookup.set(key, {
        name: market.marketName,
        priceCurrency: market.priceCurrency,
      });
    });

    return lookup;
  }, [markets]);

  useEffect(() => {
    setCurrentPage(1);
  }, [account, chainId]);

  useEffect(() => {
    if (!account || !subgraphUrl) {
      setEntries([]);
      setError(false);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchTransactions = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await request<WalletTransactionHistoryResponse>(
          subgraphUrl,
          WALLET_TRANSACTION_HISTORY_QUERY,
          { account, first: 100 }
        );

        if (cancelled) return;

        const builds =
          data.account?.builds.map((build) => ({
            id: build.id,
            type: "build" as const,
            timestamp: Number(build.timestamp),
            price: build.price,
            amountOvl: build.position?.initialNotional ?? "0",
            isLong: build.position?.isLong,
            marketAddress: build.position?.market?.id?.toLowerCase(),
            transactionHash: build.transaction?.id,
          })) ?? [];

        const unwinds =
          data.account?.unwinds.map((unwind) => ({
            id: unwind.id,
            type: "unwind" as const,
            timestamp: Number(unwind.timestamp),
            price: unwind.price,
            amountOvl: unwind.size,
            isLong: unwind.position?.isLong,
            marketAddress: unwind.position?.market?.id?.toLowerCase(),
            transactionHash: unwind.transaction?.id,
          })) ?? [];

        setEntries(
          [...builds, ...unwinds]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 100)
        );
      } catch {
        if (!cancelled) {
          setEntries([]);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
    const intervalId = window.setInterval(fetchTransactions, 15_000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [account, subgraphUrl]);

  const visibleEntries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return entries.slice(start, start + itemsPerPage);
  }, [currentPage, entries, itemsPerPage]);

  const renderBody = () => {
    if (loading && entries.length === 0) {
      return (
        <tr>
          <td colSpan={TRANSACTION_COLUMNS.length} style={{ padding: "20px 0" }}>
            <Loader />
          </td>
        </tr>
      );
    }

    if (!account) {
      return (
        <tr>
          <td colSpan={TRANSACTION_COLUMNS.length} style={{ padding: "20px 16px" }}>
            <Text style={{ color: theme.semantic.textMuted }}>No wallet connected</Text>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={TRANSACTION_COLUMNS.length} style={{ padding: "20px 16px" }}>
            <Text style={{ color: theme.semantic.negative }}>
              Unable to load transaction history
            </Text>
          </td>
        </tr>
      );
    }

    if (entries.length === 0) {
      return (
        <tr>
          <td colSpan={TRANSACTION_COLUMNS.length} style={{ padding: "20px 16px" }}>
            <Text style={{ color: theme.semantic.textMuted }}>
              No wallet transactions found
            </Text>
          </td>
        </tr>
      );
    }

    return visibleEntries.map((entry) => {
      const market = entry.marketAddress
        ? marketLookup.get(entry.marketAddress)
        : undefined;
      const priceCurrency = market?.priceCurrency ?? "$";
      const explorerHref = entry.transactionHash
        ? getExplorerLink(
            chainId,
            entry.transactionHash,
            ExplorerDataType.TRANSACTION
          )
        : undefined;

      return (
        <StyledRow key={entry.id}>
          <StyledCell>
            <CellText>{formatTime(entry.timestamp)}</CellText>
          </StyledCell>
          <StyledCell>
            <TypePill $type={entry.type}>
              {entry.type === "build" ? "Build" : "Unwind"}
            </TypePill>
          </StyledCell>
          <StyledCell>
            <CellText>{market?.name ?? shortenHash(entry.marketAddress)}</CellText>
          </StyledCell>
          <StyledCell>
            <SideText $long={entry.isLong}>
              {entry.isLong === undefined ? "-" : entry.isLong ? "Long" : "Short"}
            </SideText>
          </StyledCell>
          <StyledCell>
            <CellText>{formatWeiPrice(entry.price, priceCurrency)}</CellText>
          </StyledCell>
          <StyledCell>
            <CellText>{formatUsdAmount(entry.amountOvl, ovlPrice)}</CellText>
          </StyledCell>
          <StyledCell>
            {explorerHref ? (
              <ExplorerLink
                href={explorerHref}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open transaction ${entry.transactionHash} on explorer`}
              >
                {shortenHash(entry.transactionHash)}
              </ExplorerLink>
            ) : (
              <CellText>-</CellText>
            )}
          </StyledCell>
        </StyledRow>
      );
    });
  };

  return (
    <Panel>
      <StyledTable
        headerColumns={TRANSACTION_COLUMNS}
        variant="positions"
        minWidth="1060px"
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        positionsTotalNumber={entries.length}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        body={renderBody()}
      />
    </Panel>
  );
};

const Panel = styled.div`
  padding: 0 0 16px;
`;

const CellText = styled.span`
  color: ${theme.semantic.textPrimary};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 11px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

const TypePill = styled.span<{ $type: TransactionType }>`
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 8px;
  border-radius: ${theme.radius.xs};
  background: ${({ $type }) =>
    $type === "build" ? "rgba(50, 199, 131, 0.14)" : "rgba(255, 72, 109, 0.14)"};
  color: ${({ $type }) =>
    $type === "build" ? theme.semantic.positive : theme.semantic.negative};
  font-size: 11px;
  font-weight: 800;
`;

const SideText = styled(CellText)<{ $long?: boolean }>`
  color: ${({ $long }) =>
    $long === undefined
      ? theme.semantic.textMuted
      : $long
        ? theme.semantic.positive
        : theme.semantic.negative};
`;

const ExplorerLink = styled.a`
  color: ${theme.semantic.accent};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 11px;
  font-weight: 800;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;

export default TransactionHistoryPanel;
