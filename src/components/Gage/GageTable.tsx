import React from 'react'
import { Button, Select, Table, Tooltip, Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import { useGagesContext } from '../Provider/GageProvider'
import { updateGage } from '../../controllers'
import moment from 'moment'
import { Gage, GageMetric, GageReading } from '../../types'
import { ReadingSelect } from './ReadingSelect'
import { useNavigate } from 'react-router-dom'

const GageTable = (): JSX.Element => {
  const { gages } = useGagesContext()
  const navigate = useNavigate()

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Tooltip title={name} placement={'top'}>
          <Typography.Text ellipsis>{name}</Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: 'Primary Metric',
      dataIndex: 'metric',
      key: 'metric',
      render: (metric: GageMetric, gage: Gage) => (
        <Select
          value={metric}
          bordered={false}
          size={'small'}
          onChange={async (metric: GageMetric) => {
            await updateGage({
              ...gage,
              metric,
            })
          }}
        >
          {Object.values(GageMetric).map((m) => (
            <Select.Option value={m} key={m}>
              {m}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Readings',
      dataIndex: 'readings',
      key: 'readings',
      render: (readings: GageReading[]) => (
        <div style={{ minWidth: 150 }}>
          <ReadingSelect readings={readings || []} />
        </div>
      ),
    },
    // {
    //   title: 'Delta',
    //   dataIndex: 'delta',
    //   key: 'delta',
    // },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (val: Date) => {
        if (val) {
          return (
            <div style={{ maxWidth: 200 }}>
              <Typography.Text ellipsis>
                {moment(val).format('llll')}
              </Typography.Text>
            </div>
          )
        }
        return '-'
      },
    },
    {
      dataIndex: 'id',
      key: 'id',
      render: (id: number, gage: Gage) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => navigate(`/gage/${gage.state}/${id}`)}
            icon={<ArrowRightOutlined />}
          />
        </div>
      ),
    },
  ]

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'scroll' }}>
      <Table dataSource={gages || []} columns={columns} />
    </div>
  )
}

export default GageTable
