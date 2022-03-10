import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import { useReachContext } from './reachContext';

export const ReachDescription = () => {
  const { updateReach, data } = useReachContext();
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    (async () => {
      if (!!newDescription && newDescription !== data?.description) {
        await updateReach('description', newDescription);
      }
    })();
  }, [newDescription]);

  return (
    <Typography.Paragraph
      editable={{
        onChange: setNewDescription
      }}
    >
      {data?.description || 'n/a'}
    </Typography.Paragraph>
  );
};
