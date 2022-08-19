import React, { useState } from 'react'
import {
  Button,
  notification,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { Alert, RequestStatus } from '../../../types'
import { DeleteOutlined } from '@ant-design/icons'
import { deleteAlert, updateAlert } from '../../../controllers'
import moment from 'moment'
import { AlertChannel, AlertCriteria, AlertInterval } from '../../../enums'
import { useUserContext } from '../UserContext'
import { useTranslation } from 'react-i18next'

export const AlertTable = (): JSX.Element => {
  const { user, updateUserAlerts, removeUserAlert } = useUserContext()
  const { t } = useTranslation()
  const [deleteRequestStatus, setDeleteRequestStatus] = useState<{
    status: RequestStatus
    id: string
  }>({ id: '', status: 'success' })

  const getGageName = (gageId: string): string => {
    if (!user) return ''

    const g = user.gages.find((gage) => gage.id === gageId)

    return g?.name || ''
  }

  const getIntervalTag = (alert: Alert): JSX.Element => {
    return (
      <Tag color={alert.interval === AlertInterval.DAILY ? 'blue' : 'red'}>
        {alert.interval}
      </Tag>
    )
  }

  const getChannelTag = (alert: Alert): JSX.Element => {
    return (
      <Tag color={alert.channel === AlertChannel.EMAIL ? 'green' : 'orange'}>
        {alert.channel}
      </Tag>
    )
  }

  const getAlertDescription = (alert: Alert) => {
    let msg = `${alert.criteria}`

    if (alert.criteria === AlertCriteria.BETWEEN) {
      msg += ` ${alert.minimum}-${alert.minimum}`
    } else {
      msg += ` ${alert.value}`
    }
    msg += ` ${alert.metric}`
    return msg
  }

  const handleDelete = async (val: string) => {
    try {
      if (!user) return
      setDeleteRequestStatus({
        id: val,
        status: 'loading',
      })
      await deleteAlert(val)
      removeUserAlert(val)
      setDeleteRequestStatus({
        id: '',
        status: 'success',
      })
      notification.success({
        message: t('entityDeleted', { entity: t('alert') }),
        placement: 'bottomRight',
      })
    } catch (e) {
      setDeleteRequestStatus({
        id: '',
        status: 'failure',
      })
      notification.error({
        message: t('entityDeleteError', { entity: t('alert') }),
        placement: 'bottomRight',
      })
    }
  }

  const columns = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('description'),
      dataIndex: 'id',
      key: 'description',
      render: (val: number, alert: Alert) => {
        return (
          <div style={{ maxWidth: 550, display: 'flex' }}>
            <div>
              {getIntervalTag(alert)}
              {getChannelTag(alert)}
            </div>
            {alert.interval !== AlertInterval.IMMEDIATE ? (
              <>
                <Typography.Text type={'secondary'}>@ &nbsp;</Typography.Text>
                <Typography.Text>
                  {moment(alert?.notifyTime).format('h:mm a')}
                </Typography.Text>
              </>
            ) : (
              <>
                <Typography.Text type={'secondary'}>when</Typography.Text>
                <span>&nbsp;</span>
                <Tooltip title={getGageName(alert.gageId)}>
                  <div style={{ maxWidth: 150 }}>
                    <Typography.Text ellipsis>
                      {getGageName(alert.gageId)}
                    </Typography.Text>
                  </div>
                </Tooltip>
                <span>&nbsp;</span>
                <Typography.Text ellipsis>
                  {getAlertDescription(alert)}
                </Typography.Text>
              </>
            )}
          </div>
        )
      },
    },
    {
      title: t('lastSent'),
      dataIndex: 'lastSent',
      key: 'lastSent',
      render: (val: Date | string) => {
        if (!val || val === '0001-01-01T00:00:00Z') return '-'
        return moment(val).format('llll')
      },
    },
    {
      title: t('active'),
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean, alert: Alert) => (
        <Switch
          checked={active}
          onChange={async (active) => {
            const result = await updateAlert(alert.id, {
              ...alert,
              active,
            })
            updateUserAlerts(result)
          }}
        />
      ),
    },
    {
      dataIndex: 'id',
      key: 'id',
      render: (val: string) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => handleDelete(val)}
            icon={<DeleteOutlined />}
            danger
            size={'small'}
            loading={
              deleteRequestStatus.id === val &&
              deleteRequestStatus.status === 'loading'
            }
          />
        </div>
      ),
    },
  ]

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        overflowX: 'scroll',
        maxWidth: '100%',
        backgroundColor: '#fff',
      }}
    >
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={user?.alerts || []}
      />
    </div>
  )
}
