import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default (props) => {
  const { id, setCount } = props;
  const msgs = useSelector((state) => state.messages
    .filter((msg) => msg.channelId === id));

  useEffect(() => {
    setCount(msgs.length);
  }, [msgs.length]);
  return (
    msgs.map((message) => (
      <div className="text-break mb-2" key={message.id}>
        <b>
          {`${message.username}: `}
        </b>
        {message.body}
      </div>
    ))
  );
};