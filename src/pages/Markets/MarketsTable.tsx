import { Box, Flex, Table, Text } from "@radix-ui/themes";
import { LineChart, Line, YAxis } from "recharts";
import theme from "../../theme";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { SelectItem } from "@radix-ui/react-select";
import {
  limitDigitsInDecimals,
  toPercentUnit,
  toScientificNumber,
  TransformedMarketData,
} from "overlay-sdk";
import ProgressBar from "../../components/ProgressBar";
// import { MarketChartMap } from "../../constants/markets";
import { useMarkets7d } from "../../hooks/useMarkets7d";
import useRedirectToTradePage from "../../hooks/useRedirectToTradePage";

interface MarketsTableProps {
  marketsData: TransformedMarketData[];
}

export default function MarketsTable({
  marketsData,
}: MarketsTableProps): JSX.Element {
  const marketIds = marketsData.map((market) => market.marketId);
  const markets7d = useMarkets7d(marketIds);
  const redirectToTradePage = useRedirectToTradePage();

  return (
    <Box>
      <Table.Root
        variant="surface"
        style={{
          background: `${theme.color.background}`,
          border: "none",
          marginLeft: 50,
          marginTop: 30,
        }}
      >
        <Table.Header style={{ verticalAlign: "middle" }}>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <Box>
                <span style={{ color: theme.color.grey3 }}>ALL</span>
                <Select.Root>
                  <Select.Trigger
                    style={{
                      backgroundColor: theme.color.grey4,
                      borderRadius: 16,
                      padding: "4px 15px",
                      minHeight: 35,
                      boxShadow: "0 2px 10px var(--black-a7)",
                      border: "none",
                      color: theme.color.white,
                      marginLeft: 10,
                    }}
                  >
                    <Select.Value placeholder="Filter" />
                    <Select.Icon>
                      <ChevronDownIcon />
                    </Select.Icon>
                    <Select.Portal>
                      <Select.Content>
                        <Select.ScrollUpButton>
                          <ChevronUpIcon />
                        </Select.ScrollUpButton>
                        <Select.Viewport>
                          <Select.Group>
                            <Select.Label>Fruits</Select.Label>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                          </Select.Group>

                          <Select.Separator />

                          <Select.Group>
                            <Select.Label>Vegetables</Select.Label>
                            <SelectItem value="aubergine">Aubergine</SelectItem>
                            <SelectItem value="broccoli">Broccoli</SelectItem>
                            <SelectItem value="carrot" disabled>
                              Carrot
                            </SelectItem>
                            <SelectItem value="courgette">Courgette</SelectItem>
                            <SelectItem value="leek">Leek</SelectItem>
                          </Select.Group>

                          <Select.Separator />

                          <Select.Group>
                            <Select.Label>Meat</Select.Label>
                            <SelectItem value="beef">Beef</SelectItem>
                            <SelectItem value="chicken">Chicken</SelectItem>
                            <SelectItem value="lamb">Lamb</SelectItem>
                            <SelectItem value="pork">Pork</SelectItem>
                          </Select.Group>
                        </Select.Viewport>
                        <Select.ScrollDownButton>
                          <ChevronDownIcon />
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Trigger>
                </Select.Root>
              </Box>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>1h</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>24h</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>7d</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Funding</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>OI Balance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Oracle</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Last 7 Days</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body style={{ verticalAlign: "middle" }}>
          {marketsData &&
            marketsData.map((market, index) => {
              const market7d = markets7d.find(
                (m) => m.marketId === market.marketId
              );

              if (!market7d) return null;

              return (
                <Table.Row
                  key={index}
                  style={{
                    borderBottom: `1px solid ${theme.color.darkBlue}`,
                    cursor: "pointer",
                  }}
                  onClick={() => redirectToTradePage(market.marketId)}
                >
                  <Table.Cell style={{ padding: "8px 16px" }}>
                    <Flex>
                      <img
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        src={market.marketLogo}
                        alt={decodeURIComponent(market.marketId)}
                        className="rounded-full"
                      />
                      <span style={{ alignSelf: "center", marginLeft: 20 }}>
                        {decodeURIComponent(market.marketId)}
                      </span>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    {market.priceCurrency}
                    {market.priceCurrency === "%"
                      ? toPercentUnit(market.price)
                      : toScientificNumber(
                          Number(market.price) < 100000
                            ? limitDigitsInDecimals(market.price)
                            : Math.floor(Number(market.price)).toLocaleString(
                                "en-US"
                              )
                        )}
                  </Table.Cell>
                  <Table.Cell
                    style={{
                      color:
                        (market7d.oneHourChange ?? 0) >= 0
                          ? theme.color.green2
                          : theme.color.red2,
                    }}
                  >
                    {market7d.oneHourChange?.toFixed(2)}%
                  </Table.Cell>
                  <Table.Cell
                    style={{
                      color:
                        (market7d.sevenDayChange ?? 0) >= 0
                          ? theme.color.green2
                          : theme.color.red2,
                    }}
                  >
                    {market7d.sevenDayChange?.toFixed(2)}%
                  </Table.Cell>
                  <Table.Cell
                    style={{
                      color:
                        (market7d.twentyFourHourChange ?? 0) >= 0
                          ? theme.color.green2
                          : theme.color.red2,
                    }}
                  >
                    {market7d.twentyFourHourChange?.toFixed(2)}%
                  </Table.Cell>
                  <Table.Cell style={{ color: theme.color.green2 }}>
                    <span
                      style={{
                        color:
                          market.funding && Number(market.funding) < 0
                            ? theme.color.red2
                            : theme.color.green2,
                      }}
                    >
                      {market.funding && Number(market.funding) < 0
                        ? market.funding
                        : `+${market.funding}`}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      <Text size="2" style={{ color: theme.color.red2 }}>
                        {Math.round(Number(market.shortPercentageOfTotalOi))}%
                      </Text>
                      <ProgressBar
                        max={100}
                        value={Number(market.shortPercentageOfTotalOi)}
                      />
                      <Text size="2" style={{ color: theme.color.green2 }}>
                        {Math.round(Number(market.longPercentageOfTotalOi))}%
                      </Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={market.oracleLogo}
                      alt={decodeURIComponent(market.marketId)}
                      style={{
                        width: 24,
                        height: 24,
                        marginLeft: 8,
                        borderRadius: "50%",
                      }}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <LineChart
                      width={100}
                      height={30}
                      data={market7d.sevenDaysChartData?.map((value) => ({
                        value,
                      }))}
                      margin={{ top: 0, bottom: 0 }}
                    >
                      <YAxis
                        type="number"
                        domain={["dataMin", "dataMax"]}
                        hide
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#4ade80"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
