/* eslint no-param-reassign: "off" */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
    removeMessage: messagesAdapter.removeOne,
    removeMessages: messagesAdapter.removeMany,
    updateMessage: messagesAdapter.updateOne,
  },
});

export const messageSelectors = messagesAdapter.getSelectors((state) => state.messages);

export const {
  addMessage, addMessages, removeMessage, removeMessages, updateMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;
