import { useHistory } from 'react-router-dom';
import { Gage, GageSearchInput } from '../../types';
import { ViewButton } from '../common';
import { Form, Input, Select, Table, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import React, { useMemo, useState } from 'react';
import { usStates } from '../../helpers/usStates';
import { debounce } from 'lodash';
import { DateTime } from 'luxon';

export type GageTableProps = {
  gages: Gage[];
  loading: boolean;
  searchEnabled?: boolean;
  viewButton?: boolean;
  actions?: boolean;
  onDelete?: (id: number) => Promise<void>;
};

export const GageTable = ({
  gages,
  loading,
  searchEnabled = true,
  viewButton = true,
  actions,
  onDelete
}: GageTableProps) => {
  const history = useHistory();
  const [gageSearchInput, setGageSearchInput] = useState<GageSearchInput>({
    limit: 25,
    offset: 0,
    state: 'CO',
    country: 'US'
  });

  const memoStates = useMemo(() => usStates, []);
  const handleValueChange = debounce((val) => setGageSearchInput(Object.assign({}, gageSearchInput, val)), 300);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Latest Reading',
      dataIndex: 'latestReading',
      key: 'leatestReading',
      render(val: string, gage: Gage) {
        if (val === 'DISABLED') {
          return val;
        }
        return `${val} ${gage.metric}`;
      }
    },
    {
      title: 'Updated',
      dataIndex: 'lastFetch',
      key: 'lastFetch',
      render(val: Date, gage: Gage) {
        // @ts-ignore
        return <div>{gage.updatedAt ? DateTime.fromISO(gage.updatedAt).toFormat('LL/dd hh:mm a') : '-'}</div>;
      }
    },
    {
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => (
        <>
          {actions && (
            <div>
              <Button size={'small'} danger onClick={() => onDelete && onDelete(id)}>
                <DeleteOutlined />
              </Button>
            </div>
          )}
          {viewButton && <ViewButton onClick={() => history.push(`/gage/${id}`)} />}
        </>
      )
    }
  ];

  return (
    <>
      {searchEnabled && (
        <Form
          name="gage-search"
          layout={'horizontal'}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={gageSearchInput}
          onFinish={(evt) => {
            console.log(evt);
          }}
          onFinishFailed={() => {
            console.log('err');
          }}
          autoComplete="off"
          onValuesChange={handleValueChange}
        >
          <Form.Item label="Name" name="name" rules={[{ required: false }]}>
            <Input />
          </Form.Item>

          <Form.Item label="State" name="state" rules={[{ required: true }]}>
            <Select>
              {memoStates.map((state) => (
                <Select.Option key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Country" name="country" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={'US'}>United States</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      )}
      <Table loading={loading} dataSource={gages} columns={columns} />
    </>
  );
};
