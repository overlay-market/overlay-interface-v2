import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  align-self: center;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 16px 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
`;
