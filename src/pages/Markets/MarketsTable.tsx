import { Table } from "@radix-ui/themes";
// import { LineChart, Line } from "recharts";
import theme from "../../theme";
import * as Select from "@radix-ui/react-select";
// import OverlayLogo from "../../assets/images/overlay-logo-only-no-background.png";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { SelectItem } from "@radix-ui/react-select";
import useSDK from "../../hooks/useSDK";
import { useEffect, useState } from "react";
import useMultichainContext from "../../providers/MultichainContextProvider/useMultichainContext";

type MarketData = {
  ask: bigint;
  bid: bigint;
  capOi: bigint;
  circuitBreakerLevel: bigint;
  currency: string;
  descriptionText: string;
  disabled: boolean;
  fullLogo: string;
  fundingRate: bigint;
  id: string;
  logo: string;
  marketId: string;
  marketLogo: string;
  marketName: string;
  mid: bigint;
  oiLong: bigint;
  oiShort: bigint;
  oracleLogo: string;
  parsedAnnualFundingRate: string;
  parsedAsk: string;
  parsedBid: string;
  parsedCapOi: string;
  parsedDailyFundingRate: string;
  parsedMid: string;
  parsedOiLong: string;
  parsedOiShort: string;
  priceCurrency: string;
  volumeAsk: bigint;
  volumeBid: bigint;
};

export default function MarketsTable() {
  const [marketsData, setMarketsData] = useState<MarketData[]>([]);
  const { chainId: contextChainID } = useMultichainContext();
  const sdk = useSDK();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activeMarkets = await sdk.markets.getActiveMarkets();
        console.log("activeMarkets", activeMarkets);

        activeMarkets && setMarketsData(activeMarkets);
      } catch (error) {
        console.error("Error fetching markets:", error);
      }
    };

    fetchData();
  }, [contextChainID]);

  console.log("marketsData", marketsData[1]);
  return (
    <div className="p-4 text-white">
      <Table.Root
        variant="surface"
        style={{
          background: `${theme.color.background}`,
          border: "none",
          marginLeft: 50,
          marginTop: 30,
        }}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-gray-400">
              <div className="flex items-center justify-between">
                <span>All Markets</span>
                <Select.Root>
                  <Select.Trigger
                    style={{
                      backgroundColor: theme.color.grey8,
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
                    <Select.Icon className="SelectIcon">
                      <ChevronDownIcon />
                    </Select.Icon>
                    <Select.Portal>
                      <Select.Content className="SelectContent">
                        <Select.ScrollUpButton className="SelectScrollButton">
                          <ChevronUpIcon />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="SelectViewport">
                          <Select.Group>
                            <Select.Label className="SelectLabel">
                              Fruits
                            </Select.Label>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                          </Select.Group>

                          <Select.Separator className="SelectSeparator" />

                          <Select.Group>
                            <Select.Label className="SelectLabel">
                              Vegetables
                            </Select.Label>
                            <SelectItem value="aubergine">Aubergine</SelectItem>
                            <SelectItem value="broccoli">Broccoli</SelectItem>
                            <SelectItem value="carrot" disabled>
                              Carrot
                            </SelectItem>
                            <SelectItem value="courgette">Courgette</SelectItem>
                            <SelectItem value="leek">Leek</SelectItem>
                          </Select.Group>

                          <Select.Separator className="SelectSeparator" />

                          <Select.Group>
                            <Select.Label className="SelectLabel">
                              Meat
                            </Select.Label>
                            <SelectItem value="beef">Beef</SelectItem>
                            <SelectItem value="chicken">Chicken</SelectItem>
                            <SelectItem value="lamb">Lamb</SelectItem>
                            <SelectItem value="pork">Pork</SelectItem>
                          </Select.Group>
                        </Select.Viewport>
                        <Select.ScrollDownButton className="SelectScrollButton">
                          <ChevronDownIcon />
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Trigger>
                </Select.Root>
              </div>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-gray-400">
              Price
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-gray-400">
              1h
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-gray-400">
              24h
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-gray-400">
              7d
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-gray-400">
              Funding
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-gray-400">
              OI Balance
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-gray-400">
              Oracle
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-gray-400">
              Last 7 Days
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body style={{ verticalAlign: "middle" }}>
          {marketsData &&
            marketsData.map((market, index) => (
              <Table.Row
                key={index}
                className="border-b"
                style={{
                  borderBottom: `1px solid ${theme.color.darkBlue}`,
                }}
              >
                <Table.Cell className="px-2 py-1">
                  <div className="flex items-center justify-center">
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                      src={market.marketLogo}
                      alt={market.marketName}
                      className="rounded-full"
                    />
                  </div>
                </Table.Cell>
                {/* <Table.Cell>${market.price.toFixed(2)}</Table.Cell>
                <Table.Cell className="text-green-400">
                  ^{market.change1h.toFixed(1)}%
                </Table.Cell>
                <Table.Cell className="text-green-400">
                  ^{market.change24h.toFixed(1)}%
                </Table.Cell>
                <Table.Cell className="text-green-400">
                  ^{market.change7d.toFixed(1)}%
                </Table.Cell>
                <Table.Cell className="text-green-400">
                  +{market.funding.toFixed(2)}%
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center">
                    <div className="w-1/2 h-2 bg-red-500 rounded-l-full"></div>
                    <div className="w-1/2 h-2 bg-green-500 rounded-r-full"></div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <img
                    src={OverlayLogo}
                    alt={item.name}
                    className="w-6 h-6 ml-2 rounded-full"
                    style={{ maxHeight: 30, maxWidth: 30 }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <LineChart
                    width={100}
                    height={30}
                    data={market.map((value) => ({ value }))}
                  >
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4ade80"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </Table.Cell> */}
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
