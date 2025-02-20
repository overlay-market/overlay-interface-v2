import { styled } from "styled-components";
import theme from "../../theme";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 12px 20px;
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid
    ${({ theme, active }) => (active ? theme.primary1 : "#252534")};
  transition: all 0.2s ease;
  border-radius: 8px;
  &:hover {
    color: ${({ theme }) => theme.text1};
  }
  background: linear-gradient(${theme.color.grey7}, ${theme.color.background})
      padding-box,
    linear-gradient(90deg, ${theme.color.grey4} 0%, ${theme.color.grey4} 100%)
      border-box;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  color: ${({ theme }) => theme.text3};
  font-size: 16px;
`;
