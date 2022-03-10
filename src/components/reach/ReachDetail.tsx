import React from 'react';
import { BackButton } from '../common';
import { useReachContext } from './reachContext';
import { Typography } from 'antd';
import { ReachDescription } from './ReachDescription';

export const ReachDetail = () => {
  const { error, loading, data } = useReachContext();

  if (error) {
    return <div>Error...</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (data) {
    return (
      <div>
        <BackButton path={'/reach'} />
        <Typography.Title level={1} style={{ lineHeight: 1.25, margin: '1rem 0 0 0', padding: 0 }}>
          {data.name}
        </Typography.Title>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {data.section}
        </Typography.Title>
        <ReachDescription />
      </div>
    );
  }

  return null;
};
