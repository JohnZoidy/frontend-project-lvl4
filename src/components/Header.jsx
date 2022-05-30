import React from 'react';
import { useSelector } from 'react-redux';
import { chSelectors } from '../slices/channelsSlice.js';

export default (props) => {
  const { id, count } = props;
  const { name } = useSelector((state) => chSelectors.selectById(state, id));

  return (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <div className=".fs-5 fw-bold">
        {`# ${name}`}
      </div>
      <div className=".fs-6 text-muted">
        {`${count} messages (need to fix by i18)`}
      </div>
    </div>
  );
};
