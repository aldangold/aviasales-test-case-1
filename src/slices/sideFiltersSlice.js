/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const getCheckedFilters = (filters) => {
  const checked = filters.reduce((acc, { checked, id }) => {
    if (checked === true) acc.push(id);
    return acc;
  }, []);
  return checked;
}

const initialState = {
  currentFilters: [ 0, 1, 2, 3 ],
  filters:[
    { id: 0, name: 'none_transfer', checked: true, description: 'sideFilter.noneTransfer' },
    { id: 1, name: 'one_transfer', checked: true, description: 'sideFilter.oneTransfer' },
    { id: 2, name: 'two_transfer', checked: true, description: 'sideFilter.twoTransfer' },
    { id: 3, name: 'three_transfer', checked: true, description: 'sideFilter.threeTransfer' },
  ],
};

const sideFiltersSlice = createSlice({
  name: 'sideFilters',
  initialState,
  reducers: {
    setSideFilter(state, { payload }) {
      state.filters = state.filters.map((filter) => (payload === filter.name ? { ...filter, checked: !filter.checked } : filter));
      const checkedFilters = getCheckedFilters(state.filters);
      state.currentFilters = checkedFilters.length > 0 ? checkedFilters : [0, 1, 2, 3];
    },
    setCheckedAll(state, { payload}) {
      state.filters = state.filters.map((filter) => ({ ...filter, checked: !payload }));
      const checkedFilters = getCheckedFilters(state.filters);
      state.currentFilters = checkedFilters.length > 0 ? checkedFilters : [0, 1, 2, 3];
    }
  },
});

export const { actions } = sideFiltersSlice;
export default sideFiltersSlice.reducer;