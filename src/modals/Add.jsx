import React, {
  useEffect, useRef, useState, useContext,
} from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Modal, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { channel } from '../misc/validSchemes.js';
import { chSelectors } from '../slices/channelsSlice.js';
import { SocketContext } from '../contexts/SocketAPI.jsx';

const Add = ({ modal, onHide }) => {
  const { t } = useTranslation();
  const inputEl = useRef(null);
  const { createCh } = useContext(SocketContext);
  const channels = useSelector(chSelectors.selectAll).map((chan) => chan.name);
  const [valid, setValid] = useState({ fdbk: '', state: false });
  const [onLoad, setOnLoad] = useState(false);

  useEffect(() => {
    if (inputEl.current !== null) {
      inputEl.current.focus();
    }
  });

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validationSchema: channel(channels),
    onSubmit: (values) => {
      try {
        const channelData = { name: values.channelName };
        setOnLoad(true);
        createCh(channelData);
        onHide({ type: '', show: false });
      } catch {
        setOnLoad(false);
        setValid({ fdbk: t('networkErr'), state: true });
      }
    },
  });

  return (
    <Modal
      show={modal.show}
      onHide={() => onHide({ type: '', show: false })}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('addModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="form-group">
            <Form.Control
              ref={inputEl}
              id="name"
              isInvalid={formik.errors.channelName || valid.state}
              disabled={onLoad}
              name="channelName"
              type="text"
              placeholder={t('addModal.placeholder')}
              onChange={formik.handleChange}
              value={formik.values.channelName}
            />
            <label htmlFor="name" className="visually-hidden">{t('addModal.name')}</label>
            <Form.Control.Feedback type="invalid" className="text-start">
              {formik.errors.channelName}
              {valid.fdbk}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end mt-2">
              <input className="btn btn-primary me-2" type="submit" value={t('buttons.add')} disabled={formik.errors.channelName || onLoad} />
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => onHide({ type: '', show: false })}
                disabled={onLoad}
              >
                {t('buttons.cancel')}
              </button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
