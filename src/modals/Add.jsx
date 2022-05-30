import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Modal, Form } from 'react-bootstrap';
import { channel } from '../misc/validSchemes.js';
import { chSelectors } from '../slices/channelsSlice.js';

const Add = ({ modal, onHide, socket }) => {
  const inputEl = useRef(null);
  const channels = useSelector(chSelectors.selectAll).map((chan) => chan.name);
  const [valid, setValid] = useState({ fdbk: '', state: false });
  const [onLoad, setOnLoad] = useState(false);
  useEffect(() => {
    if (inputEl.current !== null) {
      inputEl.current.focus();
    }
  });

  const addChannel = async (name) => {
    const channelData = { name };
    setOnLoad(true);
    await socket.emit('newChannel', channelData, (response) => {
      if (response.status === 'ok') {
        onHide({ type: '', show: false });
      } else {
        setOnLoad(false);
        setValid({ fdbk: `Ошибка сети, response ${response.status}`, state: true });
      }
    });
  };

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validationSchema: channel(channels),
    onSubmit: (values) => {
      addChannel(values.channelName).catch((e) => console.log(e));
    },
  });

  return (
    <Modal
      show={modal.show}
      onHide={() => onHide({ type: '', show: false })}
    >
      <Modal.Header closeButton>
        <Modal.Title>Добавить новый канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="form-group">
            <Form.Control
              ref={inputEl}
              data-testid="input-body"
              isInvalid={formik.errors.channelName || valid.state}
              disabled={onLoad}
              name="channelName"
              type="text"
              placeholder="Введите имя для нового канала..."
              onChange={formik.handleChange}
              value={formik.values.channelName}
            />
            <Form.Control.Feedback type="invalid" className="text-start">
              {formik.errors.channelName}
              {valid.fdbk}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end mt-2">
              <input className="btn btn-primary me-2" type="submit" value="Добавить" disabled={formik.errors.channelName || onLoad} />
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => onHide({ type: '', show: false })}
                disabled={onLoad}
              >
                Отмена
              </button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
