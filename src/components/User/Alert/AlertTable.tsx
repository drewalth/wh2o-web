import React from 'react'
import {
  Button,
  notification,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { Alert } from '../../../types'
import { DeleteOutlined } from '@ant-design/icons'
import { deleteAlert, updateAlert } from '../../../controllers'
import moment from 'moment'
import { AlertChannel, AlertCriteria, AlertInterval } from '../../../enums'
import { useUserContext } from '../UserContext'
import { useTranslation } from 'react-i18next'

export const AlertTable = (): JSX.Element => {
  const { user, reload } = useUserContext()
  const { t } = useTranslation()

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

  const handleDelete = async (val: number) => {
    try {
      await deleteAlert(val)
      notification.success({
        message: t('entityDeleted', { entity: t('alert') }),
        placement: 'bottomRight',
      })
      await reload()
    } catch (e) {
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
            {getIntervalTag(alert)}
            {getChannelTag(alert)}
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
                <Tooltip title={alert?.gage?.name || t('gage')}>
                  <Typography.Text ellipsis>
                    {alert?.gage?.name || t('gage')}
                  </Typography.Text>
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
            await updateAlert({
              ...alert,
              active,
            })
          }}
        />
      ),
    },
    {
      dataIndex: 'id',
      key: 'id',
      render: (val: number) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => handleDelete(val)}
            icon={<DeleteOutlined />}
            danger
          />
        </div>
      ),
    },
  ]

  return <Table columns={columns} dataSource={user?.alerts || []} />
}
