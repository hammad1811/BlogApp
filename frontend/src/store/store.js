import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
// import thunk from "redux-thunk";

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "isActive", "userData"], // Persist only necessary fields
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Ignore persist actions
      },
    }) 
});

export const persistor = persistStore(store);
export default store;
