import styled from "styled-components";

interface PowerCardContainerProps {
  backgroundImageUrl?: string;
}

export const PowerCardContainer = styled.div<PowerCardContainerProps>`
  width: 100%;
  position: relative;
  perspective: 1000px;
  cursor: pointer;

  .card-side {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backface-visibility: hidden;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .front {
    z-index: 2;
  }

  .back {
    background: none;
    transform: rotateY(180deg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.3;
      transform: scaleX(-1);
      z-index: -1;
      backface-visibility: hidden;
      background: url(${(props) =>
        props.backgroundImageUrl ||
        "/src/assets/images/power-cards/zengarden.png"});
      width: 100%;
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
    }
  }

  .grayscale {
    filter: grayscale(1);
    cursor: auto;
  }

  img {
    width: 100%;
    height: 100%;
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
