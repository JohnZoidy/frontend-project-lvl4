import * as Yup from 'yup';
import i18next from '../i18.js';

const login = () => Yup.object({
  username: Yup.string()
    .max(20, i18next.t('valid.max', { count: 20 }))
    .trim()
    .required(i18next.t('valid.requriedLog')),
  password: Yup.string()
    .required(i18next.t('valid.requriedPass')),
});

const signUp = () => Yup.object({
  username: Yup.string()
    .max(20, i18next.t('valid.max', { count: 20 }))
    .min(3, i18next.t('valid.min', { count: 3 }))
    .trim()
    .required(i18next.t('valid.requried')),
  password: Yup.string()
    .min(6, i18next.t('valid.min', { count: 6 }))
    .required(i18next.t('valid.requried')),
  confirm: Yup.string()
    .oneOf([Yup.ref('password'), null], i18next.t('match'))
    .required(i18next.t('requriedConfirm')),
});

const channel = (arr) => Yup.object({
  channelName: Yup.string()
    .max(20, i18next.t('valid.max', { count: 20 }))
    .required(i18next.t('valid.requried'))
    .trim()
    .min(4, i18next.t('valid.min', { count: 4 }))
    .notOneOf(arr, i18next.t('valid.unique')),
});

export { login, channel, signUp };
