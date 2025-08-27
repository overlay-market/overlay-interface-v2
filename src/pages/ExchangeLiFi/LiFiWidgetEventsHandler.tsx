import {
  Route,
  RouteExecutionUpdate,
  useWidgetEvents,
  WidgetEvent,
} from "@lifi/widget";
import { useEffect } from "react";

interface Props {
  onRouteFinished: () => void;
}

export const LiFiWidgetEventsHandler: React.FC<Props> = ({
  onRouteFinished,
}) => {
  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const handleRouteCompleted = (route: Route) => {
      console.log("Route completed:", route);
      onRouteFinished();
    };

    const handleRouteFailed = (update: RouteExecutionUpdate) => {
      console.log("Route failed:", update);
      onRouteFinished();
    };

    widgetEvents.on(WidgetEvent.RouteExecutionCompleted, handleRouteCompleted);
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, handleRouteFailed);

    return () => widgetEvents.all.clear();
  }, [widgetEvents, onRouteFinished]);

  return null;
};
