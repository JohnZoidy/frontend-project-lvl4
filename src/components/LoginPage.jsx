import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import useAuth from '../hooks/AuthHook.jsx';
import routes from '../routes.js';

const LoginPage = () => {
  const nav = useHistory();
  const auth = useAuth();
  const [validState, changeValidState] = useState({ isInvalid: false, feedback: '' });

  const connect = async ({ username, password }) => {
    const request = await axios({
      method: 'post',
      url: routes.loginPath(),
      data: {
        username,
        password,
      },
    }).catch((e) => e);
    console.log(request);
    if (request.status !== 200) {
      changeValidState({ isInvalid: true, feedback: 'неверный логин или пароль' });
    } else {
      changeValidState({ isInvalid: false, feedback: '' });
      localStorage.setItem('userId', JSON.stringify(request.data));
      auth.logIn();
      nav.push('../');
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(15, 'Допустимая длина логина не более 15 символов')
        .required('Введите логин'),
      password: Yup.string()
        .min(4, 'Длина пароля должна быть не менее 4х символов')
        .required('Введите пароль'),
    }),
    onSubmit: (values) => {
      connect(values);
    },
  });

  /* if (formik.touched.password && formik.errors.password && !validState.isInvalid) {
    // need use this during validation
    changeValidState({ isInvalid: true, feedback: formik.errors.password });
  } */

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group className="form-group">
        <Form.Label htmlFor="username">Логин</Form.Label>
        <Form.Control id="username" type="text" placeholder="Ваш логин" isInvalid={validState.isInvalid} name="username" autoComplete="username" required onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.username} />
        {formik.touched.username
        && formik.errors.username ? (<div>{formik.errors.username}</div>) : null}
      </Form.Group>
      <Form.Group className="form-group">
        <Form.Label htmlFor="password">Пароль</Form.Label>
        <Form.Control id="password" placeholder="Ваш пароль" name="password" isInvalid={validState.isInvalid} autoComplete="current-password" onBlur={formik.handleBlur} required type="password" onChange={formik.handleChange} value={formik.values.password} />
        {formik.touched.password
        && formik.errors.password ? (<div>{formik.errors.password}</div>) : null}
        <Form.Control.Feedback type="invalid">
          {validState.feedback}
        </Form.Control.Feedback>
      </Form.Group>
      <Button type="submit">
        Войти
      </Button>
    </Form>
  );
};

export default LoginPage;
