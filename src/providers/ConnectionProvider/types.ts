import { createContext } from "react";
import {
  ResolvedRegister,
  UseConnectReturnType,
} from "wagmi";

export const ConnectionContext = createContext<
  UseConnectReturnType<ResolvedRegister["config"]> | undefined
>(undefined);