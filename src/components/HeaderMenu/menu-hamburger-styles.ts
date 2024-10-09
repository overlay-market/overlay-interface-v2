import styled from "styled-components";

export const StyledBurger = styled.button<{ open: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 3px;
  z-index: 50;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 24px;
  width: 24px;

  span {
    width: 18px;
    height: ${({ open }) => (open ? "2px" : "1px")};
    background: white;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 0.5px;

    &:first-child {
      transform: ${({ open }) => (open ? "rotate(45deg)" : "rotate(0)")};
    }
    &:nth-child(2) {
      opacity: ${({ open }) => (open ? "0" : "1")};
      transform: ${({ open }) => (open ? "translateX(20px)" : "translateX(0)")};
    }
    &:nth-child(3) {
      width: ${({ open }) => (open ? "18px" : "10px")};
      transform: ${({ open }) => (open ? "rotate(-45deg)" : "rotate(0)")};
    }
  }
`;