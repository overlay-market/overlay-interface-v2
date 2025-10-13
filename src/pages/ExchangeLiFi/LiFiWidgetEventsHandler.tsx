import {
  Route,
  RouteExecutionUpdate,
  useWidgetEvents,
  WidgetEvent,
} from "@lifi/widget";
import { useEffect } from "react";
import { trackEvent } from "../../utils/analytics";
import useAccount from "../../hooks/useAccount";

interface Props {
  onRouteFinished: () => void;
}

export const LiFiWidgetEventsHandler: React.FC<Props> = ({
  onRouteFinished,
}) => {
  const widgetEvents = useWidgetEvents();
  const { address } = useAccount();

  useEffect(() => {
    const handleRouteCompleted = (route: Route) => {
      console.log("Route completed:", route);

      trackEvent("exchange_swap_completed", {
        from_chain: route.fromChainId,
        to_chain: route.toChainId,
        from_token: route.fromToken.symbol,
        to_token: route.toToken.symbol,
        address: route.fromAddress ?? address ?? "not_connected",
        timestamp: new Date().toISOString(),
      });

      onRouteFinished();
    };

    const handleRouteFailed = (update: RouteExecutionUpdate) => {
      console.log("Route failed:", update);

      trackEvent("exchange_swap_failed", {
        from_chain: update.route.fromChainId,
        to_chain: update.route.toChainId,
        from_token: update.route.fromToken.symbol,
        to_token: update.route.toToken.symbol,
        address: update.route.fromAddress ?? address ?? "not_connected",
        process_type: update.process.type,
        process_status: update.process.status,
        process_substatus: update.process.substatus ?? "unknown",
        error_message: update.process.error?.message ?? "none",
        timestamp: new Date().toISOString(),
      });

      onRouteFinished();
    };

    widgetEvents.on(WidgetEvent.RouteExecutionCompleted, handleRouteCompleted);
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, handleRouteFailed);

    return () => widgetEvents.all.clear();
  }, [widgetEvents, onRouteFinished]);

  return null;
};
