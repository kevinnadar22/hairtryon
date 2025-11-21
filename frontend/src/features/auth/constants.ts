import type { AuthState } from "./types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

export default initialState;
