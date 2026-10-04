import { combineReducers, configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./notification/reducer";
import panelUserReducer from "./panelUser/reducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,

  whitelist: ["panelUser"],
};
const rootReducer = combineReducers({
  notification: notificationReducer,
  panelUser: panelUserReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
