import React from 'react'
import { Gage, GageReading } from '../../../types'
import { Button, Table, Tooltip, Typography } from 'antd'
import { ReadingSelect } from '../../Gage/ReadingSelect'
import moment from 'moment'
import { DeleteOutlined } from '@ant-design/icons'
import { removeUserGage } from '../../../controllers'
import { useUserContext } from '../UserContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const UserGageTable = () => {
  const { user } = useUserContext()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const columns = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, gage: Gage) => (
        <Tooltip title={name} placement={'top'}>
          <Typography.Link
            ellipsis
            onClick={() => navigate(`/gage/${gage.state}/${gage.id}`)}
          >
            {name}
          </Typography.Link>
        </Tooltip>
      ),
    },
    {
      title: t('readings'),
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
      title: t('updated'),
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
      render: (id: number) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            title={t('removeBookmark')}
            danger
            size={'small'}
            onClick={() => removeUserGage(id, user?.id || 0)}
            style={{ marginRight: 8 }}
          >
            <DeleteOutlined />
          </Button>
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
