import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { repository } from "../../lib/repository";

export const restoreSession = createAsyncThunk("auth/restoreSession", async () => {
  return repository.restoreSession();
});

export const signIn = createAsyncThunk("auth/signIn", async ({ email, password }) => {
  return repository.signIn(email, password);
});

export const signOut = createAsyncThunk("auth/signOut", async () => {
  await repository.signOut();
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    session: null,
    user: null,
    token: null,
    claims: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = "idle";
        state.session = action.payload;
        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.claims = action.payload?.claims || null;
      })
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = "idle";
        state.session = action.payload;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.claims = action.payload.claims;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.session = null;
        state.user = null;
        state.token = null;
        state.claims = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
