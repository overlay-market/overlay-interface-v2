import { gql } from "graphql-request";

export const queryDocument = gql`
  query MyQuery($recipient: String!) {
    streams(
      where: {
        recipient: $recipient
      }
    ) {
      alias
      sender
    }
  }
`;

export type StreamItem = {
  alias: string;
  sender: string;
};

export type StreamData = StreamItem[];

export type MyQueryResponse = {
  streams: StreamData;
};