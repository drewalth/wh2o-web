import React from 'react'
import { Gage, GageReading } from '../../../types'
import { Button, Table, Tooltip, Typography } from 'antd'
import { ReadingSelect } from '../../Gage/ReadingSelect'
import moment from 'moment'
import { ArrowRightOutlined, DeleteOutlined } from '@ant-design/icons'
import { removeUserGage } from '../../../controllers'
import { useUserContext } from '../UserContext'
import { useNavigate } from 'react-router-dom'

export const UserGageTable = () => {
  const { user } = useUserContext()
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
      render: (readings: GageReading[], gage: Gage) => (
        <div style={{ minWidth: 150 }}>
          <ReadingSelect
            readings={readings || []}
            metric={gage.metric}
            disabled={gage.disabled}
          />
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
            danger
            size={'small'}
            onClick={() => removeUserGage(id, user?.id || 0)}
            style={{ marginRight: 8 }}
          >
            <DeleteOutlined />
          </Button>
          <Button
            size={'small'}
            onClick={() => navigate(`/gage/${gage.state}/${id}`)}
            icon={<ArrowRightOutlined />}
          />
        </div>
      ),
    },
  ]

  return (
    <div style={{ maxWidth: '100%', overflowX: 'scroll' }}>
      <Table
        columns={columns}
        dataSource={user?.gages || []}
        rowKey={(g) => g.id}
      />
    </div>
  )
}
