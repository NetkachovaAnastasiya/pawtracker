import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// EVIDENCE: JavaScript - Error handling (Junior)
// EVIDENCE: Framework React - API integration (Junior)
export const fetchMedications = createAsyncThunk(
  'medications/fetchMedications',
  async (_, { getState, extra }) => {
    const { api } = extra;
    return await api.get('/medications');
  }
);

export const addMedication = createAsyncThunk(
  'medications/addMedication',
  async (medicationData, { getState, extra }) => {
    const { api } = extra;
    return await api.post('/medications', medicationData);
  }
);

export const updateMedication = createAsyncThunk(
  'medications/updateMedication',
  async (medicationData, { getState, extra }) => {
    const { api } = extra;
    return await api.put(`/medications/${medicationData.id}`, medicationData);
  }
);

export const deleteMedication = createAsyncThunk(
  'medications/deleteMedication',
  async (medicationId, { getState, extra }) => {
    const { api } = extra;
    await api.delete(`/medications/${medicationId}`);
    return medicationId;
  }
);

// EVIDENCE: Technical Process - Technical debt management (Middle)
const medicationsSlice = createSlice({
  name: 'medications',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    lastUpdated: null
  },
  reducers: {
    // Додаткові синхронні редюсери
    updateNextDose: (state, action) => {
      const { medicationId, nextDose } = action.payload;
      const medication = state.items.find(med => med.id === medicationId);
      if (medication) {
        medication.nextDose = nextDose;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch medications
      .addCase(fetchMedications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMedications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Add medication
      .addCase(addMedication.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      
      // Update medication
      .addCase(updateMedication.fulfilled, (state, action) => {
        const index = state.items.findIndex(med => med.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      
      // Delete medication
      .addCase(deleteMedication.fulfilled, (state, action) => {
        state.items = state.items.filter(med => med.id !== action.payload);
        state.lastUpdated = new Date().toISOString();
      });
  }
});

export const { updateNextDose } = medicationsSlice.actions;
export default medicationsSlice.reducer;