import { useContext } from "react";
import { MiniAppSdkContext } from "./context";

const useMiniAppSdk = () => useContext(MiniAppSdkContext);

export default useMiniAppSdk;
