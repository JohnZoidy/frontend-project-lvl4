import * as Yup from 'yup';

const login = () => Yup.object({
  username: Yup.string()
    .trim()
    .required('valid.required'),
  password: Yup.string()
    .required('valid.required'),
});

const signUp = () => Yup.object({
  username: Yup.string()
    .max(20, 'valid.maxmin')
    .min(3, 'valid.maxmin')
    .trim()
    .required('valid.required'),
  password: Yup.string()
    .min(6, 'valid.min')
    .required('valid.required'),
  confirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'valid.match')
    .required('valid.match'),
});

const channel = (arr) => Yup.object({
  channelName: Yup.string()
    .max(20, 'valid.maxminCh')
    .required('valid.required')
    .trim()
    .min(4, 'valid.maxminCh')
    .notOneOf(arr, 'valid.unique'),
});

export { login, channel, signUp };
