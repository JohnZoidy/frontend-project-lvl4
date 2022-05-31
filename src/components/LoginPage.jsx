import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import {
  Button, Form, Card, FloatingLabel, Row, Col, Image,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { login } from '../misc/validSchemes.js';
import routes from '../routes.js';
import AuthContext from '../contexts/AuthContext.jsx';
import logo from '../../assets/images/login.svg';

const LoginPage = () => {
  const nav = useHistory();
  const { t } = useTranslation();
  const { logIn } = useContext(AuthContext);
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
    if (request.status !== 200) {
      changeValidState({ isInvalid: true, feedback: t('valid.incorrect') });
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
    },
    validationSchema: login(),
    onSubmit: (values) => {
      connect(values);
    },
  });

  return (
    <div className="row justify-content-center align-content-center h-100">
      <Card className="text-center col-xxl-5 p-0">
        <Card.Header>{t('welcome')}</Card.Header>
        <Card.Body className="p-5">
          <Row>
            <Col sm={5}>
              <Image src={logo} alt="Logo" className="container-fluid" />
            </Col>
            <Col sm={6}>
              <Card.Title className="text-center mb-4 fs-2">{t('buttons.logIn')}</Card.Title>
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
                <Button
                  type="submit"
                  disabled={formik.errors.password || formik.errors.username}
                >
                  {t('buttons.logIn')}
                </Button>
              </Form>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          {t('noAccount')}
          <a href="/signup">{t('buttons.register')}</a>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default LoginPage;
