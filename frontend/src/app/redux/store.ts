import { configureStore } from "@reduxjs/toolkit";
import authUserReducer from "./slice/auth";
import serviceReducer from "./slice/service";
export const store = configureStore({
  reducer: {
    authUserReducer,
    serviceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
