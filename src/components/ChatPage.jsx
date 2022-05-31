import axios from 'axios';
import React, {
  useEffect, useState, useRef, useContext,
} from 'react';
import {
  Container, Row, Col, Button, InputGroup, FormControl, Form,
} from 'react-bootstrap';
import { useDispatch, batch } from 'react-redux';
import { useFormik } from 'formik';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import * as filter from 'leo-profanity';
import {
  addChannels, addChannel, removeChannel, updateChannel,
} from '../slices/channelsSlice.js';
import { setMessages, addMessage } from '../slices/messagesSlice.js';
import routes from '../routes.js';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import Header from './Header.jsx';
import getModal from '../modals/index.js';
import AuthContext from '../contexts/AuthContext.jsx';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const renderModal = (modal, showModal, socket, current) => {
  if (!modal.show) {
    return null;
  }

  const Component = getModal(modal.type);
  return <Component modal={modal} onHide={showModal} socket={socket} current={current} />;
};

const ChatPage = ({ socket, username }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const inputField = useRef();
  const inputForm = useRef();
  const [currentCh, setCurrentCh] = useState();
  const [count, setCount] = useState();
  const [modal, showModal] = useState({ type: '', show: false });
  const { logOut } = useContext(AuthContext);
  // const scroll = useScrollToBottom();
  const sendMessage = async (body, channelId, user) => {
    const messageData = {
      body,
      channelId,
      username: user,
    };
    await socket.emit('newMessage', messageData);
  };

  const handleErrors = (err) => {
    toast.error(`${t('toast.error')} ${err}`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const formik = useFormik({
    initialValues: {
      messageText: '',
    },
    onSubmit: (values) => {
      inputForm.current.setAttribute('disabled', true);
      sendMessage(values.messageText, currentCh, username, inputField.current)
        .catch((e) => console.log(e));
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
        dispatch(addChannels(data.channels));
        dispatch(setMessages(data.messages));
      });
      setCurrentCh(data.currentChannelId);
    };

    fetchContent();
  }, []);

  useEffect(() => {
    socket.on('newMessage', (data) => {
      dispatch(addMessage(data));
    });
    socket.on('newChannel', (data) => {
      dispatch(addChannel(data));
      setCurrentCh(data.id);
      toast.success(t('toast.create'), {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
    socket.on('removeChannel', (data) => {
      dispatch(removeChannel(data.id));
      toast.success(t('toast.delete'), {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
    socket.on('renameChannel', (data) => {
      dispatch(updateChannel({ id: data.id, changes: data }));
      toast.success(t('toast.rename'), {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
    socket.on('connect_error', (err) => handleErrors(err));
    socket.on('connect_failed', (err) => handleErrors(err));
    socket.on('disconnect', (err) => handleErrors(err));
  }, [socket]);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [currentCh]);

  return (currentCh
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
            id={currentCh}
            changeCurrent={setCurrentCh}
            showModal={showModal}
            filter={filter}
          />
        </Col>
        <Col className="p-0 h-100 text-start">
          <div className="d-flex flex-column h-100">
            <Header id={currentCh} count={count} />
            <ScrollToBottom className="message-list px-5">
              <Messages id={currentCh} setCount={setCount} filter={filter} />
            </ScrollToBottom>
            <div className="mt-auto px-2 py-3">
              <Form onSubmit={formik.handleSubmit} ref={inputForm}>
                <InputGroup>
                  <FormControl
                    placeholder={t('messagePlace')}
                    aria-describedby="basic-addon2"
                    id="messageText"
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
      {renderModal(modal, showModal, socket, currentCh)}
      <ToastContainer />
    </Container>
    )
  );
};

export default ChatPage;
