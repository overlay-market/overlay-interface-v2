import { Box, Flex, Table, Text } from "@radix-ui/themes";
// import { LineChart, Line } from "recharts";
import theme from "../../theme";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { SelectItem } from "@radix-ui/react-select";
import useSDK from "../../hooks/useSDK";
import { useEffect, useState } from "react";
import useMultichainContext from "../../providers/MultichainContextProvider/useMultichainContext";
import { TransformedMarketData } from "overlay-sdk";

export default function MarketsTable() {
  const [marketsData, setMarketsData] = useState<TransformedMarketData[]>([]);
  const { chainId: contextChainID } = useMultichainContext();
  const sdk = useSDK();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activeMarkets = await sdk.markets.transformMarketsData();

        activeMarkets && setMarketsData(activeMarkets);
      } catch (error) {
        console.error("Error fetching markets:", error);
      }
    };

    fetchData();
  }, [contextChainID]);

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
                <span style={{ color: theme.color.grey4 }}>All</span>
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
            marketsData.map((market, index) => (
              <Table.Row
                key={index}
                style={{
                  borderBottom: `1px solid ${theme.color.darkBlue}`,
                }}
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
                <Table.Cell>${market.price}</Table.Cell>
                <Table.Cell style={{ color: "green" }}>1%</Table.Cell>
                <Table.Cell style={{ color: "green" }}>1%</Table.Cell>
                <Table.Cell style={{ color: "green" }}>1%</Table.Cell>
                <Table.Cell style={{ color: "green" }}>1%</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    <Text size="2">
                      {Math.round(Number(market.shortPercentageOfTotalOi))}%
                    </Text>
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100px",
                        height: "8px",
                        backgroundColor: "#000000",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        style={{
                          width: `${market.shortPercentageOfTotalOi}%`,
                          backgroundColor: "#FF5A5A",
                          height: "100%",
                          marginRight: "5px",
                        }}
                      />
                      <Box
                        style={{
                          width: `${market.longPercentageOfTotalOi}%`,
                          backgroundColor: "#4CAF50",
                          height: "100%",
                        }}
                      />
                    </Box>
                    <Text size="2">
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
                <Table.Cell>/</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
