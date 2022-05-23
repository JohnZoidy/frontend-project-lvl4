/* eslint no-param-reassign: "off" */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState();

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel: channelsAdapter.removeOne,
    updateChannel: channelsAdapter.updateOne,
  },
});

export const channelsSelectors = channelsAdapter.getSelectors((state) => state.channels);

export const {
  addChannel, addChannels, removeChannel, updateChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;
