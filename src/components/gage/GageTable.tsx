import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Gage, GageSearchInput, GageSearchResponse } from '../../types';
import { ViewButton } from '../common';
import { Button, Form, Input, Select, Table, TableColumnsType } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { GAGES_SEARCH } from './queries';
import { usStates } from '../../helpers/usStates';
import { debounce } from 'lodash';
import { DateTime } from 'luxon';
import { useUserContext } from '../user/userContext';

export const GageTable = () => {
  const history = useHistory();
  const test = useUserContext();
  const [gageSearchInput, setGageSearchInput] = useState<GageSearchInput>({
    limit: 25,
    offset: 0,
    state: 'CO',
    country: 'US'
  });
  const { data, loading, error } = useQuery<{ gagesSearch: GageSearchResponse }>(GAGES_SEARCH, {
    variables: {
      gageSearchInput
    }
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
    // {
    //   title: 'Unit',
    //   dataIndex: 'gages',
    //   key: 'gages'
    //   // render: (val: Gage[]) => {
    //   //   return val[0]?.name || 'n/a';
    //   // }
    // },
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
      render: (id: number) => <ViewButton onClick={() => history.push(`/gage/${id}`)} />
    }
  ];

  const getPagination = () => {
    return {
      total: data?.gagesSearch.total,
      pageSize: 25
    };
  };

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
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

        {/*<Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>*/}
        {/*  <Checkbox>Remember me</Checkbox>*/}
        {/*</Form.Item>*/}
      </Form>
      <Table
        loading={loading}
        dataSource={data?.gagesSearch.gages || []}
        columns={columns}
        pagination={getPagination()}
        onChange={(val) => {
          console.log('val', val);
        }}
      />
    </>
  );
};
