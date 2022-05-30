import * as Yup from 'yup';
import i18next from '../i18.js';

const login = () => Yup.object({
  username: Yup.string()
    .max(20, i18next.t('valid.max', { count: 20 }))
    .trim()
    .required(i18next.t('valid.required')),
  password: Yup.string()
    .required(i18next.t('valid.required')),
});

const signUp = () => Yup.object({
  username: Yup.string()
    .max(20, i18next.t('valid.max', { count: 20 }))
    .min(3, i18next.t('valid.min', { count: 3 }))
    .trim()
    .required(i18next.t('valid.required')),
  password: Yup.string()
    .min(6, i18next.t('valid.min', { count: 6 }))
    .required(i18next.t('valid.required')),
  confirm: Yup.string()
    .oneOf([Yup.ref('password'), null], i18next.t('valid.match'))
    .required(i18next.t('valid.requiredConfirm')),
});

const channel = (arr) => Yup.object({
  channelName: Yup.string()
    .max(20, i18next.t('valid.max', { count: 20 }))
    .required(i18next.t('valid.required'))
    .trim()
    .min(4, i18next.t('valid.min', { count: 4 }))
    .notOneOf(arr, i18next.t('valid.unique')),
});

export { login, channel, signUp };
