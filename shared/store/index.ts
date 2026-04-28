import { configureStore } from "@reduxjs/toolkit";

import { appApi } from "@/shared/api/appApi";
import { userReducer } from "@/features/user/userStore";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [appApi.reducerPath]: appApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(appApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
