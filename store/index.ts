import { configureStore } from "@reduxjs/toolkit";

import { careInvitationApi } from "./care-invitation/api";
import { careRelationshipApi } from "./care-relationship/api";
import { historyApi } from "./history/api";
import { medicationApi } from "./medication/api";
import { medicationUiReducer } from "./medication/ui-slice";
import { patientApi } from "./patient/api";
import { scheduleApi } from "./schedule/api";
import { userApi } from "./user/api";
import { userReducer } from "./user/slice";
import { validationApi } from "./validation/api";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: userReducer,
      medicationUi: medicationUiReducer,
      [careInvitationApi.reducerPath]: careInvitationApi.reducer,
      [careRelationshipApi.reducerPath]: careRelationshipApi.reducer,
      [historyApi.reducerPath]: historyApi.reducer,
      [medicationApi.reducerPath]: medicationApi.reducer,
      [patientApi.reducerPath]: patientApi.reducer,
      [scheduleApi.reducerPath]: scheduleApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [validationApi.reducerPath]: validationApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        careInvitationApi.middleware,
        careRelationshipApi.middleware,
        historyApi.middleware,
        medicationApi.middleware,
        patientApi.middleware,
        scheduleApi.middleware,
        userApi.middleware,
        validationApi.middleware
      ),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
