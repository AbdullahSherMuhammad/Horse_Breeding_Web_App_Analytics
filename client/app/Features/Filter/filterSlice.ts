import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  year?: number;
  gender_id?: number;
  show_id?: number;
  farm_id?: number;
}

const initialState: FilterState = {};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<FilterState>) => {
      return { ...state, ...action.payload };
    },
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
