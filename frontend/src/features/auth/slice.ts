import { createSlice } from "@reduxjs/toolkit";
import initialState from "./constants";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./types";

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        // Define your reducers here
        login: (state, action: PayloadAction<{ user: User }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;

            state.status = "succeeded";
            state.error = null;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.status = "succeeded";
            state.error = null;
        },
        setAuthStatus: (state, action: PayloadAction<"idle" | "loading" | "succeeded" | "failed">) => {
            state.status = action.payload;
        }
    },
});

export const { login, logout, setAuthStatus } = authSlice.actions;
export default authSlice.reducer;