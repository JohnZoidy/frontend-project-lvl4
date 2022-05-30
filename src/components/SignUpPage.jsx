import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import {
  Button, Form, Card, FloatingLabel,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { signUp } from '../misc/validSchemes.js';
import routes from '../routes.js';
import AuthContext from '../contexts/AuthContext.jsx';

const SignUpPage = () => {
  const nav = useHistory();
  const { logIn } = useContext(AuthContext);
  const [validState, changeValidState] = useState({ isInvalid: false, feedback: '' });
  const { t } = useTranslation();
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
      changeValidState({ isInvalid: true, feedback: t('valid.exist') });
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
        <Card.Header>{t('welcome')}</Card.Header>
        <Card.Body>
          <Card.Title>{t('buttons.register')}</Card.Title>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="form-group">
              <FloatingLabel controlId="username" label={t('login')} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder={t('login')}
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
              <FloatingLabel controlId="password" label={t('pass')} className="mb-3">
                <Form.Control
                  name="password"
                  placeholder={t('pass')}
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
              <FloatingLabel controlId="confirm" label={t('valid.requiredConfirm')} className="mb-3">
                <Form.Control
                  name="confirm"
                  placeholder={t('valid.requiredConfirm')}
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
              {t('buttons.register')}
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer />
      </Card>
    </div>
  );
};

export default SignUpPage;
