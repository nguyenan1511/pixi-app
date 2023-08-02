import { useEventEmitter } from "ahooks";
import { createContext, useContext } from "react";

export const ListenerContext = createContext(null);

const ListenerProvider = (props) => {
  const listener = useEventEmitter();

  return (
    <ListenerContext.Provider value={listener}>
      {props.children}
    </ListenerContext.Provider>
  );
};

export default ListenerProvider;

export const useListener = () => {
  const context = useContext(ListenerContext);
  if (!context) {
    throw new Error(
      "useListener has to be used within <ListenerContext.Provider>"
    );
  }

  return context;
};
