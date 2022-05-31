import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Remove = ({
  modal, onHide, socket, current,
}) => {
  const { t } = useTranslation();
  const [onLoad, setOnLoad] = useState(false);
  const removeChannel = async (id) => {
    const channelData = { id };
    setOnLoad(true);
    if (id === current) {
      modal.setDefault(1); // not good
    }
    await socket.emit('removeChannel', channelData, (response) => {
      if (response.status === 'ok') {
        onHide({ type: '', show: false });
      } else {
        setOnLoad(false);
        // alert - network error
      }
    });
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
            Удалить
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
