/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentFilter: 'sort_by_price',
  filters: [
    { id: 1, name: 'sort_by_price', description: 'topFilter.sortByPrice' },
    { id: 2, name: 'sort_by_speed', description: 'topFilter.sortBySpeed' },
    { id: 3, name: 'optimal_sort', description: 'topFilter.optimalSort' },
  ],
};

const topFiltersSlice = createSlice({
  name: 'topFilters',
  initialState,
  reducers: {
    setCurrentFilter(state, { payload }) {
      state.currentFilter = payload;
    },
  },
});

export const { actions } = topFiltersSlice;
export default topFiltersSlice.reducer;