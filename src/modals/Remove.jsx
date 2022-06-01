import React, { useState, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SocketContext } from '../contexts/SocketAPI.jsx';

const Remove = ({ modal, onHide }) => {
  const { t } = useTranslation();
  const [onLoad, setOnLoad] = useState(false);
  const { removeCh } = useContext(SocketContext);

  const removeChannel = (id) => {
    const channelData = { id };
    setOnLoad(true);
    try {
      removeCh(channelData);
      onHide({ type: '', show: false });
    } catch {
      setOnLoad(false);
    }
  };

  return (
    <Modal
      show={modal.show}
      onHide={() => onHide({ type: '', show: false })}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('removeModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Modal.Title>{t('removeModal.confirm')}</Modal.Title>
        <div className="d-flex justify-content-end mt-2">
          <button
            className="btn btn-danger me-2"
            type="button"
            onClick={() => removeChannel(modal.data)}
            disabled={onLoad}
          >
            {t('buttons.delete')}
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => onHide({ type: '', show: false })}
            disabled={onLoad}
          >
            {t('buttons.cancel')}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
