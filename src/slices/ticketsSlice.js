/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const defaultStackTickets = 5;

const initialState = {
  ticketsStack: defaultStackTickets,
  tickets: [],
  reconciledTickets: [],
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setTickets(state, { payload }) {
      state.tickets = payload;
    },
    setReconciledTickets(state, { payload }) {
      state.reconciledTickets = payload;
    },
    setDefaultStackTickets(state) {
      state.ticketsStack = defaultStackTickets;
    },
    addStackTickets(state) {
      state.ticketsStack = state.ticketsStack + defaultStackTickets;
    },
  },
});

export const { actions } = ticketsSlice;
export default ticketsSlice.reducer;