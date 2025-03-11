import { gql } from "@apollo/client";

export const GET_USERS_POWER_CARDS = gql`
  query GetUsersPowerCards {
    account(id: "0x1D5b02978d14F9111A685D746d3e360d9e33A541") {
      erc1155Tokens {
        id
        amount
        burnt
        token {
          tokenUri
          address
          id
          tokenId
        }
      }
    }
  }
`;
