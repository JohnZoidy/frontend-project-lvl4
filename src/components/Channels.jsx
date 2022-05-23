import React from 'react';
import { useSelector } from 'react-redux';
import { channelsSelectors } from '../slices/channelsSlice.js';

export default () => {
  const channels = useSelector(channelsSelectors.selectAll);

  // const renderChannel = (channel) => <div key={channel.id}>{channel.name}</div>;

  return (
    channels.map((chan) => <div key={chan.id}>{chan.name}</div>)
  );
};
