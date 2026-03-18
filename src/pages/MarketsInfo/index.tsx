import { useMemo, useState } from "react";
import { Badge, Button, Flex, Skeleton, Text } from "@radix-ui/themes";
import StyledTable from "../../components/Table";
import { useAggregatorContracts } from "../../hooks/useAggregatorContracts";
import { formatNumberForDisplay } from "../../utils/formatNumberForDisplay";
import {
  AccentText,
  DataCell,
  DataRow,
  EmptyState,
  HeroCard,
  PageWrapper,
  StatCard,
  StatsGrid,
  TableCard,
} from "./markets-info-styles";

const headerColumns = [
  "Pair",
  "Ticker",
  "Product",
  "Contract",
  "Last Price",
  "24H High",
  "24H Low",
  "24H Volume (Quote)",
  "24H Volume (Base)",
  "Open Interest",
  "Open Interest (USD)",
  "Funding Rate (Daily)",
  "Updated",
] as const;

const PLACEHOLDER_ROWS = 8;

const formatMetric = (
  value: number | undefined,
  unit?: string,
  { prefix, maxFractionDigits = 4 }: { prefix?: string; maxFractionDigits?: number } = {}
) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—";
  }

  const formattedValue = formatNumberForDisplay(value, 10, maxFractionDigits);

  if (prefix) {
    return `${prefix}${formattedValue}`;
  }

  return unit ? `${formattedValue} ${unit}` : formattedValue;
};

const formatFundingRate = (value: number | undefined) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—";
  }

  const percentValue = value * 100;

  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
    signDisplay: "exceptZero",
  }).format(percentValue)}%`;
};

const formatTimestamp = (unixTimestamp: number | undefined) => {
  if (typeof unixTimestamp !== "number" || !Number.isFinite(unixTimestamp) || unixTimestamp <= 0) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(unixTimestamp * 1000));
};

const MarketsInfo: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const {
    data: contracts = [],
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useAggregatorContracts();

  const sortedContracts = useMemo(
    () => [...contracts].sort((left, right) => left.ticker_id.localeCompare(right.ticker_id)),
    [contracts]
  );

  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedContracts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage, sortedContracts]);

  const totalOpenInterestUsd = useMemo(
    () => sortedContracts.reduce((total, contract) => total + (contract.open_interest_usd || 0), 0),
    [sortedContracts]
  );

  const uniqueQuoteCurrencies = useMemo(
    () => new Set(sortedContracts.map((contract) => contract.target_currency)).size,
    [sortedContracts]
  );

  const lastUpdatedLabel = useMemo(() => {
    if (!dataUpdatedAt) {
      return "Awaiting first sync";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    }).format(new Date(dataUpdatedAt));
  }, [dataUpdatedAt]);

  const renderLoadingRows = () => {
    return Array.from({ length: PLACEHOLDER_ROWS }).map((_, index) => (
      <DataRow key={`loading-row-${index}`}>
        {headerColumns.map((column) => (
          <DataCell key={`${column}-${index}`}>
            <Skeleton width="100%" height="18px" />
          </DataCell>
        ))}
      </DataRow>
    ));
  };

  const renderRows = () => {
    return paginatedContracts.map((contract) => (
      <DataRow key={contract.ticker_id}>
        <DataCell>
          <Flex direction="column" gap="1">
            <Text size="2" weight="medium" style={{ color: "#FFFFFF" }}>
              {contract.base_currency} / {contract.target_currency}
            </Text>
            <Text size="1" style={{ color: "#A8A6A6" }}>
              {contract.index_name || `${contract.base_currency} index`}
            </Text>
          </Flex>
        </DataCell>
        <DataCell>
          <Text size="2">{contract.ticker_id}</Text>
        </DataCell>
        <DataCell>
          <Text size="2" style={{ textTransform: "capitalize" }}>
            {contract.product_type}
          </Text>
        </DataCell>
        <DataCell>
          <Text size="2" style={{ textTransform: "capitalize" }}>
            {contract.contract_type}
          </Text>
        </DataCell>
        <DataCell>
          <Text size="2">{formatMetric(contract.last_price, contract.target_currency, { maxFractionDigits: 6 })}</Text>
        </DataCell>
        <DataCell>
          <Text size="2">{formatMetric(contract.high, contract.target_currency, { maxFractionDigits: 6 })}</Text>
        </DataCell>
        <DataCell>
          <Text size="2">{formatMetric(contract.low, contract.target_currency, { maxFractionDigits: 6 })}</Text>
        </DataCell>
        <DataCell>
          <Text size="2">{formatMetric(contract.target_volume, contract.target_currency, { maxFractionDigits: 4 })}</Text>
        </DataCell>
        <DataCell>
          <Text size="2">{formatMetric(contract.base_volume, contract.base_currency, { maxFractionDigits: 4 })}</Text>
        </DataCell>
        <DataCell>
          <Text size="2">{formatMetric(contract.open_interest, contract.base_currency, { maxFractionDigits: 4 })}</Text>
        </DataCell>
        <DataCell>
          <Text size="2">{formatMetric(contract.open_interest_usd, undefined, { prefix: "$", maxFractionDigits: 2 })}</Text>
        </DataCell>
        <DataCell>
          <Text size="2">{formatFundingRate(contract.funding_rate)}</Text>
        </DataCell>
        <DataCell>
          <Text size="2">{formatTimestamp(contract.end_timestamp)}</Text>
        </DataCell>
      </DataRow>
    ));
  };

  return (
    <PageWrapper>
      <HeroCard>
        <Flex direction="column" gap="3">
          <Badge size="2" radius="full" style={{ width: "fit-content", backgroundColor: "#6e6e8bff" }}>
            Public Markets Info
          </Badge>
          <Text size="8" weight="bold" style={{ color: "#FFFFFF", lineHeight: 1.05 }}>
            Overlay <AccentText>Coins/Markets Info Page</AccentText>
          </Text>
          <Text size="3" style={{ color: "#A8A6A6", maxWidth: "920px", lineHeight: 1.6 }}>
            Public reference page for listing verification.
          </Text>
        </Flex>

        <StatsGrid>
          <StatCard>
            <Text size="1" style={{ color: "#A8A6A6", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Markets Listed
            </Text>
            <Text size="7" weight="bold" style={{ color: "#FFFFFF", marginTop: 8 }}>
              {sortedContracts.length}
            </Text>
          </StatCard>
          <StatCard>
            <Text size="1" style={{ color: "#A8A6A6", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Total Open Interest
            </Text>
            <Text size="7" weight="bold" style={{ color: "#FFFFFF", marginTop: 8 }}>
              {formatMetric(totalOpenInterestUsd, undefined, { prefix: "$", maxFractionDigits: 2 })}
            </Text>
          </StatCard>
          <StatCard>
            <Text size="1" style={{ color: "#A8A6A6", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Quote Currencies
            </Text>
            <Text size="7" weight="bold" style={{ color: "#FFFFFF", marginTop: 8 }}>
              {uniqueQuoteCurrencies}
            </Text>
          </StatCard>
        </StatsGrid>
      </HeroCard>

      <TableCard>
        <Flex justify="between" align={{ initial: "start", sm: "center" }} direction={{ initial: "column", sm: "row" }} gap="3">
          <Flex direction="column" gap="1">
            <Text size="6" weight="bold" style={{ color: "#FFFFFF" }}>
              Derivatives Markets Table
            </Text>
            <Text size="2" style={{ color: "#A8A6A6" }}>
              Refreshes once per minute. Last sync: {lastUpdatedLabel}
            </Text>
          </Flex>
          <Button
            onClick={() => refetch()}
            variant="soft"
            style={{ backgroundColor: "#252534", color: "#FFFFFF", cursor: "pointer" }}
          >
            Refresh
          </Button>
        </Flex>

        {isError ? (
          <EmptyState direction="column" gap="3">
            <Text size="5" weight="medium" style={{ color: "#FFFFFF" }}>
              Unable to load markets info
            </Text>
            <Text size="2" style={{ color: "#A8A6A6", maxWidth: "520px" }}>
              {error instanceof Error ? error.message : "Unknown error while loading aggregator contracts."}
            </Text>
            <Button onClick={() => refetch()} style={{ cursor: "pointer" }}>
              Try Again
            </Button>
          </EmptyState>
        ) : !isLoading && sortedContracts.length === 0 ? (
          <EmptyState direction="column" gap="3">
            <Text size="5" weight="medium" style={{ color: "#FFFFFF" }}>
              No markets are currently enabled
            </Text>
            <Text size="2" style={{ color: "#A8A6A6", maxWidth: "520px" }}>
              The aggregator API returned an empty list. Once markets are enabled in the backend, they will
              appear here automatically.
            </Text>
          </EmptyState>
        ) : (
          <StyledTable
            headerColumns={[...headerColumns]}
            currentPage={currentPage}
            positionsTotalNumber={sortedContracts.length}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
            minWidth="1480px"
            body={isLoading ? renderLoadingRows() : renderRows()}
          />
        )}
      </TableCard>
    </PageWrapper>
  );
};

export default MarketsInfo;
