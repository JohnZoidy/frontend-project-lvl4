import axios from 'axios';
import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// import { batch } from 'redux';
import { useDispatch } from 'react-redux';
import { addChannels } from '../slices/channelsSlice.js';
import { addMessages } from '../slices/messagesSlice.js';
import routes from '../routes.js';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const ChatPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(routes.dataPath(), { headers: getAuthHeader() })
        .catch((e) => console.log(e));
      dispatch(addChannels(data.channels));
      dispatch(addMessages(data.messages));
    };

    fetchContent();
  }, []);

  return (
    <Container>
      <Row>
        <Col sm={2}>
          <Channels />
        </Col>
        <Col sm>
          <div>Header</div>
          <div>
            <p>Message box</p>
            <Messages />
          </div>
          <div>Form</div>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
