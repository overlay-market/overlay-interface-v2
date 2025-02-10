import styled from "styled-components";
import theme from "../../theme";
import { Flex } from "@radix-ui/themes";

export const CustomCard = styled(Flex)`
  aspect-ratio: 200 / 257;
  width: 100%;
  max-width: 200px;
  border-radius: 20px;
  border: 1px solid rgba(236, 236, 236, 0.15);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

  @media (max-width: 480px) {
    max-width: 150px;
  }
`;

export const CardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export const CardContent = styled(Flex)`
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  width: 100%;
  padding: 0.5rem;
  text-align: center;
  color: white;
  border-radius: 0 0 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: end;
`;

export const CardsValue = styled.h2`
  margin: 0;
  font-size: clamp(0.8rem, 3vw, 1.2rem);
  color: ${theme.color.white};
  -webkit-text-stroke: 0.5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

export const CardsTitle = styled.h2`
  margin: 0;
  font-size: clamp(0.6rem, 2.5vw, 0.9rem);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;
