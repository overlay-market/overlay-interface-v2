import { styled } from "styled-components";

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
  position: relative;
  background: ${({ active, theme }) => (active ? theme.color.grey4 : "none")};
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${({ active }) => (active ? "transparent" : "#252534")};
  transition: all 0.2s ease;
  border-radius: 8px;
  color: ${({ active }) => (active ? "transparent" : "white")};

  ${({ active }) =>
    active &&
    `
    &::before {
      content: attr(data-text);
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
      -webkit-background-clip: text;
      background-clip: text;
    }
  `}
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  color: ${({ theme }) => theme.text3};
  font-size: 16px;
`;
