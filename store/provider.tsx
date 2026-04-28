import { PropsWithChildren, useRef } from "react";
import { Provider } from "react-redux";

import { AppStore, makeStore } from "./index";

export const AppStoreProvider = ({
  children,
}: PropsWithChildren) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
