import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import {
  Button, Form, Card, FloatingLabel, Row, Col, Image,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { signUp } from '../misc/validSchemes.js';
import routes from '../routes.js';
import { AuthContext } from '../contexts/AuthContext.jsx';
import logo from '../../assets/images/signup.svg';

const SignUpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
      changeValidState({ isInvalid: true, feedback: t('valid.exist') });
    } else {
      changeValidState({ isInvalid: false, feedback: '' });
      localStorage.setItem('userId', JSON.stringify(request.data));
      logIn(username);
      const { from } = location.state || { from: { pathname: routes.mainPage() } };
      navigate(from, { replace: true });
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
      <Card className="text-center col-xxl-6 col-12 col-md-8 p-0 shadow-sm">
        <Card.Header>{t('welcome')}</Card.Header>
        <Card.Body className="p-5">
          <Row>
            <Col sm={4}>
              <Image src={logo} alt="Logo" fluid />
            </Col>
            <Col sm={8}>
              <Card.Title className="text-center mb-4 fs-2">{t('regPage.title')}</Card.Title>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="form-group">
                  <FloatingLabel controlId="username" label={t('regPage.login')} className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder={t('regPage.login')}
                      isInvalid={formik.errors.username || validState.isInvalid}
                      name="username"
                      required
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.username}
                    />
                    <Form.Control.Feedback type="invalid" className="text-start" tooltip>
                      {t(formik.errors.username)}
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
                      {validState.isInvalid ? validState.feedback : t(formik.errors.password)}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="form-group">
                  <FloatingLabel controlId="confirm" label={t('passConfirm')} className="mb-3">
                    <Form.Control
                      name="confirm"
                      placeholder={t('passConfirm')}
                      isInvalid={formik.errors.confirm || validState.isInvalid}
                      onBlur={formik.handleBlur}
                      required
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.confirm}
                    />
                    <Form.Control.Feedback type="invalid" className="text-start" tooltip>
                      {validState.isInvalid ? validState.feedback : t(formik.errors.confirm)}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Button
                  type="submit"
                >
                  {t('buttons.register')}
                </Button>
              </Form>
            </Col>
          </Row>

        </Card.Body>
        <Card.Footer />
      </Card>
    </div>
  );
};

export default SignUpPage;
