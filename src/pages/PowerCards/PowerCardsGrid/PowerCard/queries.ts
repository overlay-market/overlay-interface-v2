import { gql } from "@apollo/client";

export const GET_USERS_POWER_CARDS = gql`
  query GetUsersPowerCards($accountId: ID!) {
    account(id: $accountId) {
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
export const GET_ALL_POWER_CARDS = gql`
  query GetAllPowerCards {
    erc1155Tokens {
      address
      id
      tokenId
      tokenUri
      totalBurnt
      totalSupply
    }
  }
`;
