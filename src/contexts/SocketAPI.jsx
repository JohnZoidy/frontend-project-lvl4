/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import i18next from '../i18.js';

import { addChannel, removeChannel, updateChannel } from '../slices/channelsSlice.js';
import { addMessage } from '../slices/messagesSlice.js';

export const SocketContext = createContext({});

const SocketProvider = ({ children, socket }) => {
  const dispatch = useDispatch();
  const [currentChId, setCurrentCh] = useState('');
  const setActiveChannel = (id) => setCurrentCh(id ?? 1);

  const createCh = (channelData) => socket.emit('newChannel', channelData, (response) => {
    if (response.status === 'ok') {
      setActiveChannel(channelData.id);
    }
  });

  socket.on('newChannel', (data) => {
    dispatch(addChannel(data));
    toast.success(i18next.t('toast.create'));
  });

  const createMessage = (messageData) => socket.emit('newMessage', messageData);

  socket.on('newMessage', (data) => {
    dispatch(addMessage(data));
    console.log('wf??');
  });

  const renameCh = (data) => socket.emit('renameChannel', data);

  socket.on('renameChannel', (data) => {
    dispatch(updateChannel({ id: data.id, changes: data }));
  });

  const removeCh = (data) => socket.emit('removeChannel', data, (response) => {
    if (response.status === 'ok') {
      if (data.id === currentChId) {
        setActiveChannel(1);
      }
      toast.success(i18next.t('toast.rename'));
    }
  });

  socket.on('removeChannel', (data) => {
    dispatch(removeChannel(data.id));
    toast.success(i18next.t('toast.delete'));
  });

  socket.on('connect_error', (err) => toast.error(`${i18next.t('toast.error')} ${err}`));
  socket.on('connect_failed', (err) => toast.error(`${i18next.t('toast.error')} ${err}`));
  socket.on('disconnect', (err) => toast.error(`${i18next.t('toast.error')} ${err}`));

  return (
    <SocketContext.Provider value={{
      createCh, createMessage, renameCh, removeCh, currentChId, setActiveChannel,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
