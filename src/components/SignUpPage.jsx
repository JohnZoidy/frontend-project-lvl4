import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import {
  Button, Form, Card, FloatingLabel,
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { signUp } from '../misc/validSchemes.js';
import routes from '../routes.js';
import AuthContext from '../contexts/AuthContext.jsx';

const SignUpPage = () => {
  const nav = useHistory();
  const { logIn } = useContext(AuthContext);
  const [validState, changeValidState] = useState({ isInvalid: false, feedback: '' });

  const connect = async ({ username, password }) => {
    const request = await axios({
      method: 'post',
      url: routes.signUpPath(),
      data: {
        username,
        password,
      },
    }).catch((e) => e);
    if (request.status !== 201) {
      console.log(request.status);
      changeValidState({ isInvalid: true, feedback: 'Такой пользователь уже существует' });
    } else {
      changeValidState({ isInvalid: false, feedback: '' });
      localStorage.setItem('userId', JSON.stringify(request.data));
      logIn(username);
      nav.push('../');
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirm: '',
    },
    validationSchema: signUp(),
    onSubmit: (values) => {
      connect(values);
    },
  });

  return (
    <div className="row justify-content-center align-content-center h-100">
      <Card className="text-center col-xxl-6 col-12 col-md-8">
        <Card.Header>Добро пожаловать в чат на минималках</Card.Header>
        <Card.Body>
          <Card.Title>Регистрация</Card.Title>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="form-group">
              <FloatingLabel controlId="username" label="Логин" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Логин"
                  isInvalid={formik.errors.username || validState.isInvalid}
                  name="username"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
                <Form.Control.Feedback type="invalid" className="text-start" tooltip>
                  {formik.errors.username}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="form-group">
              <FloatingLabel controlId="password" label="Пароль" className="mb-3">
                <Form.Control
                  name="password"
                  placeholder="Пароль"
                  isInvalid={formik.errors.password || validState.isInvalid}
                  onBlur={formik.handleBlur}
                  required
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                <Form.Control.Feedback type="invalid" className="text-start" tooltip>
                  {validState.isInvalid ? validState.feedback : formik.errors.password}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="form-group">
              <FloatingLabel controlId="confirm" label="Повторите пароль" className="mb-3">
                <Form.Control
                  name="confirm"
                  placeholder="Повторите пароль"
                  isInvalid={formik.errors.confirm || validState.isInvalid}
                  onBlur={formik.handleBlur}
                  required
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.confirm}
                />
                <Form.Control.Feedback type="invalid" className="text-start" tooltip>
                  {validState.isInvalid ? validState.feedback : formik.errors.confirm}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Button
              type="submit"
              disabled={formik.errors.password || formik.errors.confirm || formik.errors.username}
            >
              Регистрация
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer />
      </Card>
    </div>
  );
};

export default SignUpPage;
