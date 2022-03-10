import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

type BackButtonProps = {
  path: string;
};

export const BackButton = ({ path }: BackButtonProps) => {
  const history = useHistory();
  return (
    <Button onClick={() => history.push(path)} size="small">
      <ArrowLeftOutlined />
    </Button>
  );
};
