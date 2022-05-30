/* eslint no-param-reassign: "off" */
import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice.js';

const initialState = [];

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.push(action.payload);
    },
    setMessages: (state, action) => {
      action.payload.map((mes) => state.push(mes));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, action) => {
      const channelId = action.payload;
      const newState = state.filter((e) => e.channelId !== channelId);
      return newState;
    });
  },
});

export const { addMessage, setMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
