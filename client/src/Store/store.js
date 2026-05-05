import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import usersReducer from "../Features/UserSlice";
import plantsReducer from "../Features/PlantSlice";

const persistConfig = {
  key:       "root",
  storage,
  whitelist: ["users"], // ← only persist users (login stays after refresh)
};

const rootReducer = combineReducers({
  users:  usersReducer,
  plants: plantsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);