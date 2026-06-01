import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { repository } from "../../lib/repository";
import { normalizeEntityValues } from "../../lib/validation";
import { RESOURCE_ORDER } from "../../lib/schema";

export const loadResource = createAsyncThunk("data/loadResource", async (resource) => {
  const rows = await repository.list(resource);
  return { resource, rows };
});

export const loadCoreData = createAsyncThunk("data/loadCoreData", async () => {
  const entries = await Promise.all(RESOURCE_ORDER.map(async (resource) => [resource, await repository.list(resource)]));
  return Object.fromEntries(entries);
});

export const saveEntity = createAsyncThunk("data/saveEntity", async ({ resource, id, values, pk }) => {
  const normalized = normalizeEntityValues(resource, values);
  const row = id ? await repository.update(resource, id, normalized) : await repository.create(resource, normalized);
  return { resource, row, pk };
});

export const deleteEntity = createAsyncThunk("data/deleteEntity", async ({ resource, id, pk }) => {
  await repository.remove(resource, id);
  return { resource, id, pk };
});

const initialTables = Object.fromEntries(RESOURCE_ORDER.map((resource) => [resource, []]));

const dataSlice = createSlice({
  name: "data",
  initialState: {
    tables: initialTables,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadResource.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadResource.fulfilled, (state, action) => {
        state.status = "idle";
        state.tables[action.payload.resource] = action.payload.rows;
      })
      .addCase(loadCoreData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadCoreData.fulfilled, (state, action) => {
        state.status = "idle";
        state.tables = { ...state.tables, ...action.payload };
      })
      .addCase(saveEntity.fulfilled, (state, action) => {
        const { resource, row, pk } = action.payload;
        const rows = state.tables[resource] || [];
        const index = rows.findIndex((item) => String(item[pk]) === String(row[pk]));
        if (index >= 0) rows[index] = row;
        else rows.push(row);
      })
      .addCase(deleteEntity.fulfilled, (state, action) => {
        const { resource, id, pk } = action.payload;
        state.tables[resource] = state.tables[resource].filter((item) => String(item[pk]) !== String(id));
      })
      .addMatcher((action) => action.type.startsWith("data/") && action.type.endsWith("/rejected"), (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
