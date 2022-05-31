import React from 'react';
import { useSelector } from 'react-redux';
import { Nav, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { chSelectors } from '../slices/channelsSlice.js';

export default ({
  id, changeCurrent, showModal, filter,
}) => {
  const channels = useSelector(chSelectors.selectAll);
  const { t } = useTranslation();

  const ChannelList = () => channels
    .map((chan) => {
      if (chan.removable) {
        return (
          <Dropdown className="mw-100" as={ButtonGroup} key={chan.id}>
            <Nav.Link className="text-truncate" key={chan.id} eventKey={chan.id}>{filter.clean(chan.name)}</Nav.Link>

            <Dropdown.Toggle style={{ flex: 'none' }} split variant="primary" />

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => showModal({ type: 'renaming', show: true, data: { name: chan.name, id: chan.id } })}>{t('buttons.rename')}</Dropdown.Item>
              <Dropdown.Item onClick={() => showModal({
                type: 'removing', show: true, data: chan.id, setDefault: changeCurrent,
              })}
              >
                {t('buttons.delete')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
      return <Nav.Link key={chan.id} eventKey={chan.id}>{chan.name}</Nav.Link>;
    });

  return (
    <Nav
      variant="pills"
      className="text-start flex-column"
      activeKey={id}
      onSelect={(selectedKey) => changeCurrent(Number(selectedKey))}
    >
      <ChannelList />
    </Nav>

  );
};
