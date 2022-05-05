import { configureStore } from '@reduxjs/toolkit';
import ticketsReducer from './ticketsSlice.js';
import topFiltersReducer from './topFiltersSlice.js';
import sideFiltersReducer from './sideFiltersSlice.js';

export default configureStore({
  reducer: {
    ticketsReducer,
    topFiltersReducer,
    sideFiltersReducer,
  },
});
