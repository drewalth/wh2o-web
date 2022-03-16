import { useQuery } from '@apollo/client'
import { Gage, GageSearchInput, GageSearchResponse } from '../../types'
import { ViewButton } from '../../components/common'
import { Card, Col, Form, Input, Row, Select, Table, Tooltip, Typography } from 'antd'
import React, { useMemo, useState } from 'react'
import { GAGES_SEARCH } from '../../components/gage/queries'
import { usStates } from '../../helpers/usStates'
import { debounce } from 'lodash'
import { DateTime } from 'luxon'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { navigate } from 'gatsby'

const Index = () => {
  const [gageSearchInput, setGageSearchInput] = useState<GageSearchInput>({
    limit: 25,
    offset: 0,
    state: 'CO',
    country: 'US'
  })
  const { data, loading, error } = useQuery<{ gagesSearch: GageSearchResponse }>(GAGES_SEARCH, {
    variables: {
      gageSearchInput
    }
  })

  const memoStates = useMemo(() => usStates, [])
  const handleValueChange = debounce((val) => setGageSearchInput(Object.assign({}, gageSearchInput, val)), 300)

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
          return val
        }
        return `${val} ${gage.metric}`
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
        return <div>{gage.updatedAt ? DateTime.fromISO(gage.updatedAt).toFormat('LL/dd hh:mm a') : '-'}</div>
      }
    },
    {
      dataIndex: 'id',
      key: 'id',
      render: (id: number, gage: Gage) => (
        <ViewButton onClick={() => navigate(`/gages/${gage.state?.toLocaleLowerCase()}/${id}`)} />
      )
    }
  ]

  const getPagination = () => {
    return {
      total: data?.gagesSearch.total,
      pageSize: 25
    }
  }

  if (error) {
    return <div>Something went wrong</div>
  }

  return (
    <>
      <Typography.Title level={1} style={{ lineHeight: 1.25, margin: '1rem 0 0 0', padding: 0 }}>
        Gages
      </Typography.Title>
      <Row style={{ marginBottom: 24, marginTop: 24 }}>
        <Col>
          <Form
            name="gage-search"
            layout="inline"
            labelCol={{
              xs: { span: 24 },
              sm: { span: 6 }
            }}
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 24 }
            }}
            initialValues={gageSearchInput}
            onFinish={(evt) => {
              console.log(evt)
            }}
            onFinishFailed={() => {
              console.log('err')
            }}
            autoComplete="off"
            onValuesChange={handleValueChange}
          >
            <Form.Item name="name" rules={[{ required: false }]}>
              <Input placeholder={'Gage name'} />
            </Form.Item>

            <Form.Item name="state" rules={[{ required: true }]}>
              <Select>
                {memoStates.map((state) => (
                  <Select.Option key={state.abbreviation} value={state.abbreviation}>
                    {state.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="country" rules={[{ required: true }]}>
              <Select>
                <Select.Option value={'US'}>United States</Select.Option>
              </Select>
            </Form.Item>
            <div style={{ display: 'flex', flexFlow: 'column no-wrap', alignItems: 'center' }}>
              <Tooltip placement="top" title={'Search for gages by name, state, and country.'}>
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            {/*<Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>*/}
            {/*  <Checkbox>Remember me</Checkbox>*/}
            {/*</Form.Item>*/}
          </Form>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card>
            <Table
              loading={loading}
              dataSource={data?.gagesSearch.gages || []}
              columns={columns}
              pagination={getPagination()}
              onChange={(val) => {
                console.log('val', val)
              }}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Index
