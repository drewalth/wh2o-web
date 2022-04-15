import React from 'react'
import { Button, Table, Tooltip, Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import { useGagesContext } from '../Provider/GageProvider'
import moment from 'moment'
import { Gage, GageReading } from '../../types'
import { ReadingSelect } from './ReadingSelect'
import { useNavigate } from 'react-router-dom'

const GageTable = (): JSX.Element => {
  const { gages, pagination, setSearchParams, searchParams } = useGagesContext()
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
      title: 'Readings',
      dataIndex: 'readings',
      key: 'readings',
      render: (readings: GageReading[]) => (
        <div style={{ minWidth: 150 }}>
          <ReadingSelect readings={readings || []} />
        </div>
      ),
    },
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
      <Table
        dataSource={gages || []}
        columns={columns}
        pagination={{
          total: pagination.total,
          showSizeChanger: true,
          pageSize: pagination.limit,
          pageSizeOptions: [10, 25, 50],
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              limit: pageSize,
              offset: page === 1 ? 0 : (page - 1) * pagination.limit,
            })
          },
        }}
      />
    </div>
  )
}

export default GageTable
