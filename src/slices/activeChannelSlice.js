import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice.js';

const initialState = { id: undefined };

const activeChannelSlice = createSlice({
  name: 'activeChannel',
  initialState,
  reducers: {
    setActive: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.id = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, action) => {
      const channelId = action.payload;
      if (channelId === state.id) {
        return { id: 1 };
      }
      return state;
    });
  },
});

export const { setActive } = activeChannelSlice.actions;

export default activeChannelSlice.reducer;
