import React from 'react'
import { GageReading } from '../../../types'
import { Button, Table, Tooltip, Typography } from 'antd'
import { ReadingSelect } from '../../Gage/ReadingSelect'
import moment from 'moment'
import { DeleteOutlined } from '@ant-design/icons'
import { removeUserGage } from '../../../controllers'
import { useUserContext } from '../UserContext'

export const UserGageTable = () => {
  const { user } = useUserContext()

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
      render: (gageId: number) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            danger
            size={'small'}
            onClick={() => removeUserGage(gageId, user?.id || 0)}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ]

  return <Table columns={columns} dataSource={user?.gages || []} />
}
