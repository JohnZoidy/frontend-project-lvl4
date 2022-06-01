/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import i18next from '../i18.js';
import { setActive } from '../slices/activeChannelSlice.js';

import { addChannel, removeChannel, updateChannel } from '../slices/channelsSlice.js';
import { addMessage } from '../slices/messagesSlice.js';

export const SocketContext = createContext({});

const SocketProvider = ({ children, socket }) => {
  const dispatch = useDispatch();

  const createCh = (channelData) => socket.emit('newChannel', channelData, (response) => {
    if (response.status === 'ok') {
      dispatch(setActive(response.data.id));
      toast.success(i18next.t('toast.create'));
    }
  });

  socket.on('newChannel', (data) => {
    dispatch(addChannel(data));
  });

  const createMessage = (messageData) => socket.emit('newMessage', messageData);

  socket.on('newMessage', (data) => {
    dispatch(addMessage(data));
  });

  const renameCh = (data) => socket.emit('renameChannel', data, (response) => {
    if (response.status === 'ok') {
      toast.success(i18next.t('toast.rename'));
    }
  });

  socket.on('renameChannel', (data) => {
    dispatch(updateChannel({ id: data.id, changes: data }));
  });

  const removeCh = (data) => socket.emit('removeChannel', data, (response) => {
    if (response.status === 'ok') {
      toast.success(i18next.t('toast.delete'));
    }
  });

  socket.on('removeChannel', (data) => {
    dispatch(removeChannel(data.id));
  });

  socket.on('connect_error', (err) => toast.error(`${i18next.t('toast.error')} ${err}`));
  socket.on('connect_failed', (err) => toast.error(`${i18next.t('toast.error')} ${err}`));
  socket.on('disconnect', (err) => toast.error(`${i18next.t('toast.error')} ${err}`));

  return (
    <SocketContext.Provider value={{
      createCh, createMessage, renameCh, removeCh,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
