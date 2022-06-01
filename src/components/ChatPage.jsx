import axios from 'axios';
import React, {
  useEffect, useState, useRef, useContext,
} from 'react';
import {
  Container, Row, Col, Button, InputGroup, FormControl, Form,
} from 'react-bootstrap';
import { useDispatch, batch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as filter from 'leo-profanity';
import { addChannels } from '../slices/channelsSlice.js';
import { setMessages } from '../slices/messagesSlice.js';
import { setActive } from '../slices/activeChannelSlice.js';
import routes from '../routes.js';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import Header from './Header.jsx';
import getModal from '../modals/index.js';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { SocketContext } from '../contexts/SocketAPI.jsx';

const renderModal = (modal, showModal) => {
  if (!modal.show) {
    return null;
  }

  const Component = getModal(modal.type);
  return <Component modal={modal} onHide={showModal} />;
};

const ChatPage = ({ username }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const inputField = useRef();
  const inputForm = useRef();
  const { createMessage } = useContext(SocketContext);
  const [count, setCount] = useState();
  const [modal, showModal] = useState({ type: '', show: false });
  const { logOut, getAuthHeader } = useContext(AuthContext);
  const currentChId = useSelector((state) => state.activeChannel.id);

  const formik = useFormik({
    initialValues: {
      messageText: '',
    },
    onSubmit: (values) => {
      inputForm.current.setAttribute('disabled', true);
      const messageData = {
        body: values.messageText,
        channelId: currentChId,
        username,
      };
      createMessage(messageData);
      inputForm.current.removeAttribute('disabled');
      formik.setFieldValue('messageText', '', false);
      inputField.current.focus();
    },
  });

  useEffect(() => {
    filter.loadDictionary('ru');
    const fetchContent = async () => {
      const { data } = await axios.get(routes.dataPath(), { headers: getAuthHeader() })
        .catch((e) => {
          if (e.response.status === 401) {
            toast.error(t('toast.authErr'), {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            logOut();
          } else {
            console.log(e);
          }
        });
      batch(() => {
        dispatch(setActive(data.currentChannelId));
        dispatch(addChannels(data.channels));
        dispatch(setMessages(data.messages));
      });
    };

    fetchContent();
  }, []);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [currentChId]);

  return (currentChId
    && (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end pt-3 px-0 bg-light">
          <div className="p-3 d-flex justify-content-between fs-5">
            Каналы
            <button
              className="text-end badge bg-success"
              type="button"
              onClick={() => showModal({ type: 'adding', show: true })}
            >
              &#8853;
            </button>
          </div>
          <Channels
            id={currentChId}
            showModal={showModal}
            filter={filter}
          />
        </Col>
        <Col className="p-0 h-100 text-start">
          <div className="d-flex flex-column h-100">
            <Header id={currentChId} count={count} />
            <ScrollToBottom className="message-list px-5">
              <Messages id={currentChId} setCount={setCount} filter={filter} />
            </ScrollToBottom>
            <div className="mt-auto px-2 py-3">
              <Form onSubmit={formik.handleSubmit} ref={inputForm}>
                <InputGroup>
                  <FormControl
                    placeholder={t('messagePlace')}
                    aria-describedby="basic-addon2"
                    id="messageText"
                    aria-label="Новое сообщение"
                    onChange={formik.handleChange}
                    value={formik.values.messageText}
                    ref={inputField}
                  />
                  <Button type="submit" disabled={!formik.values.messageText} variant="outline-success">
                    &#9655;
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
      {renderModal(modal, showModal)}
    </Container>
    )
  );
};

export default ChatPage;
