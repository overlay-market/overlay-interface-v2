import styled from "styled-components";

export const PowerCardContainer = styled.div`
  width: 100%;
  height: auto;
  border-radius: 30px;
  transition: 0.5s;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  overflow: hidden;
  background-image: url("placeholder-card-background.png"); /* Replace with actual image */
  background-size: cover;
  background-position: center;
  border: none; /* Remove border */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Add subtle shadow */

  &:hover {
    transform: perspective(1000px) rotateY(180deg);
  }
`;

export const CardImage = styled.img`
  display: inline-block;
  width: 100%;
  height: 100%;
  border-radius: 30px;
  backface-visibility: hidden;
  transform: perspective(1000px) rotateY(0deg);
  transition: 0.5s;
  box-shadow: 0 25px 15px rgb(0 0 0 / 50%);
  width: 100%;
  border-radius: 12px;
  aspect-ratio: 1 / 1.2;
  object-fit: cover;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Add subtle shadow */

  ${PowerCardContainer}:hover & {
    transform: perspective(1000px) rotateY(180deg);
  }
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0; /* Add padding */
`;

export const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text1};
  margin: 0;
`;

export const CardDescription = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text2};
  margin: 0;
`;

export const CardStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: ${({ theme }) => theme.text3};
`;
