import { PropsWithChildren, createContext, useEffect } from "react";
import { UserRejectedRequestError } from "viem";
import {
  ResolvedRegister,
  UseConnectReturnType,
  useConnect as useConnectWagmi,
} from "wagmi";
import useDisconnect from "../../hooks/useDisconnect";

const ConnectionContext = createContext<
  UseConnectReturnType<ResolvedRegister["config"]> | undefined
>(undefined);

const ConnectionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { disconnect } = useDisconnect();

  const connection = useConnectWagmi({
    mutation: {
      onMutate({ connector }) {
        console.log(`Connection activating: ${connector.name}`);
      },
      onSuccess(_, { connector }) {
        console.log(`Connection activated: ${connector.name}`);
      },
      onError(error, { connector }) {
        if (error instanceof UserRejectedRequestError) {
          connection.reset();
          return;
        }
        console.log(`Connection failed: ${connector.name}`, error.message);
      },
    },
  });

  useEffect(() => {
    if (connection.isPending) {
      connection.reset();
      disconnect();
    }
  }, [connection, disconnect]);

  return (
    <ConnectionContext.Provider value={connection}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
