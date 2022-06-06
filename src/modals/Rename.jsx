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

const Rename = ({ modal, onHide }) => {
  const { t } = useTranslation();
  const { renameCh } = useContext(SocketContext);
  const inputEl = useRef(null);
  const channels = useSelector(chSelectors.selectAll).map((chan) => chan.name);
  const [valid, setValid] = useState({ fdbk: '', state: false });

  useEffect(() => {
    if (inputEl.current !== null) {
      inputEl.current.select();
      inputEl.current.focus();
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      channelName: modal.data.name,
    },
    validationSchema: channel(channels),
    onSubmit: (values) => {
      try {
        setValid({ fdbk: '', state: false });
        const channelData = { id: modal.data.id, name: values.channelName };
        renameCh(channelData);
        onHide({ type: '', show: false });
      } catch {
        formik.setSubmitting(false);
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
        <Modal.Title>{t('renameModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="form-group">
            <Form.Control
              ref={inputEl}
              id="name"
              isInvalid={formik.errors.channelName || valid.state}
              name="channelName"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.channelName}
              disabled={formik.isSubmitting}
            />
            <label htmlFor="name" className="visually-hidden">{t('renameModal.name')}</label>
            <Form.Control.Feedback type="invalid" className="text-start">
              {t(formik.errors.channelName)}
              {valid.fdbk}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end mt-2">
              <input className="btn btn-primary me-2" type="submit" value={t('buttons.rename')} disabled={formik.errors.channelName || formik.isSubmitting} />
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => onHide({ type: '', show: false })}
                disabled={formik.isSubmitting}
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

export default Rename;
