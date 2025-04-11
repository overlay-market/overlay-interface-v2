import { combineReducers } from "redux";
import trade from "./trade/reducer";
import powercards from "./powercards/reducer";

const reducer = combineReducers({
  trade,
  powercards,
});

export default reducer;
