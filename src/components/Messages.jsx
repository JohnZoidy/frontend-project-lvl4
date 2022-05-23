import React from 'react';
import { useSelector } from 'react-redux';
import { messageSelectors } from '../slices/messagesSlice.js';

export default () => {
  const messages = useSelector(messageSelectors.selectAll);

  // const renderMessage = (message) => <div key={message.id}>{message.name}</div>;

  return (
    messages.map((message) => <div key={message.id}>{message.text}</div>)
  );
};
