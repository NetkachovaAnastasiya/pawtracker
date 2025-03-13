// src/redux/slices/dogsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// EVIDENCE: JavaScript - Error handling (Junior)
// EVIDENCE: Framework React - API integration (Junior)
export const fetchDogs = createAsyncThunk(
  'dogs/fetchDogs',
  async (_, { getState, extra }) => {
    const { api } = extra;
    return await api.get('/dogs');
  }
);

export const addDog = createAsyncThunk(
  'dogs/addDog',
  async (dogData, { getState, extra }) => {
    const { api } = extra;
    return await api.post('/dogs', dogData);
  }
);

export const updateDog = createAsyncThunk(
  'dogs/updateDog',
  async (dogData, { getState, extra }) => {
    const { api } = extra;
    return await api.put(`/dogs/${dogData.id}`, dogData);
  }
);

export const deleteDog = createAsyncThunk(
  'dogs/deleteDog',
  async (dogId, { getState, extra }) => {
    const { api } = extra;
    await api.delete(`/dogs/${dogId}`);
    return dogId;
  }
);

// EVIDENCE: Technical Process - Technical debt management (Middle)
const dogsSlice = createSlice({
  name: 'dogs',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    lastUpdated: null
  },
  reducers: {
    // Додаткові синхронні редюсери, якщо потрібно
  },
  extraReducers: (builder) => {
    builder
      // Fetch dogs
      .addCase(fetchDogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Add dog
      .addCase(addDog.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      
      // Update dog
      .addCase(updateDog.fulfilled, (state, action) => {
        const index = state.items.findIndex(dog => dog.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      
      // Delete dog
      .addCase(deleteDog.fulfilled, (state, action) => {
        state.items = state.items.filter(dog => dog.id !== action.payload);
        state.lastUpdated = new Date().toISOString();
      });
  }
});

export default dogsSlice.reducer;