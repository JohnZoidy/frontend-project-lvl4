// @ts-check

const host = '';
const prefix = 'api/v1';

export default {
  channelsPath: () => [host, prefix, 'channels'].join('/'),
  loginPath: () => [host, prefix, 'login'].join('/'), // my route
  signUpPath: () => [host, prefix, 'signup'].join('/'), // my route
  dataPath: () => [host, prefix, 'data'].join('/'), // my route
  channelPath: (id) => [host, prefix, 'channels', id].join('/'),
  channelMessagesPath: (id) => [host, prefix, 'channels', id, 'messages'].join('/'),
};
