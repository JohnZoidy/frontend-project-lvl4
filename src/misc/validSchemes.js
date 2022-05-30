import * as Yup from 'yup';

const login = () => Yup.object({
  username: Yup.string()
    .max(15, 'Допустимая длина логина не более 15 символов')
    .trim()
    .required('Введите логин'),
  password: Yup.string()
    .min(4, 'Длина пароля должна быть не менее 4х символов')
    .required('Введите пароль'),
});

const channel = (arr) => Yup.object({
  channelName: Yup.string()
    .max(20, 'Допустимая длина названия от 4 до 20 символов')
    .required('Обязтельное поле')
    .trim()
    .min(4, 'Допустимая длина названия от 4 до 20 символов')
    .notOneOf(arr, 'Должно быть уникальным'),
});

export { login, channel };
