import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const Container = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: -16px;
  margin-bottom: 100px;
  height: 100%;

  @media (min-width: ${theme.breakpoints.sm}) {
    flex-direction: row;
    margin-top: 0;
    margin-bottom: 0;
    min-width: 660px;
    max-width: 848px;
    width: 100%;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    width: 848px;
    padding-top: 4px;
    gap: 20px;
  }
`;

export const ImgBox = styled(Flex)`
  width: 100%;
  max-width: 414px;
  justify-content: center;
  height: 100%;
  flex: 1;

  img {
    width: 100%;
    height: 100%;
  }
`;

export const InfoBox = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  max-width: 414px;
  gap: 32px;
  padding: 0;
  flex: 1;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 16px;
    border-radius: 12px;
    background: ${theme.color.grey4};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    padding: 20px;
  }
`;

export const Badge = styled(Flex)`
  align-items: center;
  width: fit-content;
  padding: 4px 12px;
  border-radius: 16px;
  background: ${theme.color.green2}20;
`;

export const Details = styled(Flex)`
  flex-direction: column;
  border-radius: 8px;
  background: ${theme.color.grey4};

  @media (min-width: ${theme.breakpoints.sm}) {
    background: ${theme.color.background};
  }
`;

export const StatsDetails = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #2c2c2c;
`;

export const InfoDetails = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  gap: 90px;
`;

export const TextItem = styled(Text)`
  font-weight: 500;
  text-align: right;
  line-height: 17px;
`;
