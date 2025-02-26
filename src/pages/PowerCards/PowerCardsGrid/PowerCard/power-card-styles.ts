import styled from "styled-components";

export const PowerCardContainer = styled.div`
  width: 100%;
  aspect-ratio: 3/4; // This maintains the card proportions
  cursor: pointer;
  position: relative;
  perspective: 1000px;

  .card-side {
    width: 100%;
    height: 100%;
    position: absolute;
    backface-visibility: hidden;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .back {
    background: #2a2a2a;
    // border-radius: 16px;
    transform: rotateY(180deg);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    // border-radius: 16px;
  }

  &:hover {
    .front {
      transform: rotateY(180deg);
    }
    .back {
      transform: rotateY(0);
    }
  }
`;

export const CardButton = styled.button`
  padding: 12px 24px;
  background: #404040;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #505050;
  }
`;
