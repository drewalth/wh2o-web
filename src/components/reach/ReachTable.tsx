import React from 'react';
import { useQuery } from '@apollo/client';
import { REACHES } from './queries';
import { Gage, Reach } from '../../types';
import { Table } from 'antd';
import { ViewButton } from '../common';
import { useHistory } from 'react-router-dom';

export const ReachTable = () => {
  const history = useHistory();
  const { data, loading, error } = useQuery<{ reaches: Reach[] }>(REACHES);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class'
    },
    {
      title: 'Gage(s)',
      dataIndex: 'gages',
      key: 'gages',
      render: (val: Gage[]) => {
        return val[0]?.name || 'n/a';
      }
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updateAt'
    },
    {
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => <ViewButton onClick={() => history.push(`/reach/${id}`)} />
    }
  ];

  if (error) {
    return <div>Something went wrong</div>;
  }

  return <Table loading={loading} dataSource={data?.reaches || []} columns={columns} />;
};
