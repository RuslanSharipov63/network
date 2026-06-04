import { configureStore } from "@reduxjs/toolkit";
import authUserReducer from "./slice/auth";
import serviceReducer from "./slice/service";
import chatReducer from './slice/chat';

export const store = configureStore({
  reducer: {
    authUserReducer,
    serviceReducer,
    chatReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
