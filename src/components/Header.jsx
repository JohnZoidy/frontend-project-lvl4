import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { chSelectors } from '../slices/channelsSlice.js';

const Header = (props) => {
  const { id, count } = props;
  const { t } = useTranslation();
  const chan = useSelector((state) => chSelectors.selectById(state, id));

  return (chan
    && (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <div className=".fs-5 fw-bold">
        {`# ${chan.name}`}
      </div>
      <div className=".fs-6 text-muted">
        {t('message', { count })}
      </div>
    </div>
    )
  );
};

export default Header;
