import { styled } from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.bg3};
  margin-bottom: 24px;
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  background: none;
  border: none;
  color: ${({ theme, active }) => (active ? theme.text1 : theme.text3)};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid
    ${({ theme, active }) => (active ? theme.primary1 : "transparent")};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text1};
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  color: ${({ theme }) => theme.text3};
  font-size: 16px;
`;
