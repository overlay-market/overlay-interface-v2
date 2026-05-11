import styled from "styled-components";
import theme from "../../theme";
import { Flex } from "@radix-ui/themes";

export const CustomCard = styled.button`
  aspect-ratio: 172 / 220;
  width: 100%;
  max-width: 172px;
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.semantic.border};
  background-color: ${theme.semantic.panel};
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  box-shadow: none;
  padding: 0;
  color: ${theme.semantic.textPrimary};
  transition: transform 0.16s ease, border-color 0.16s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
      linear-gradient(180deg, rgba(5, 6, 7, 0.08), rgba(5, 6, 7, 0.82)),
      linear-gradient(90deg, rgba(5, 6, 7, 0.36), rgba(5, 6, 7, 0.12));
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: ${theme.semantic.accent};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }

  @media (max-width: 480px) {
    max-width: 146px;
  }
`;

export const CardContent = styled(Flex)`
  background: linear-gradient(to top, rgba(5, 6, 7, 0.86), rgba(5, 6, 7, 0.18));
  width: 100%;
  padding: 10px;
  text-align: center;
  color: ${theme.semantic.textPrimary};
  border-radius: 0 0 ${theme.radius.md} ${theme.radius.md};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: end;
`;

export const CardsValue = styled.h2`
  margin: 0;
  font-size: 18px;
  color: ${theme.semantic.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

export const CardsTitle = styled.h2`
  margin: 0;
  font-size: 13px;
  line-height: 1.25;
  color: ${theme.semantic.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;
