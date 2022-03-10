import React from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

type ViewButtonProps = {
  onClick: () => void;
};

export const ViewButton = ({ onClick }: ViewButtonProps) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Button onClick={onClick} size="small" style={{ paddingTop: 0 }}>
      <ArrowRightOutlined />
    </Button>
  </div>
);
