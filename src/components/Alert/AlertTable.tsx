import React from 'react'
import { useAlertsContext } from '../Provider/AlertProvider'
import {
  Button,
  notification,
  Table,
  Tag,
  Tooltip,
  Typography,
  Switch,
} from 'antd'
import { Alert } from '../../types'
import { DeleteOutlined } from '@ant-design/icons'
import { deleteAlert, updateAlert } from '../../controllers'
import moment from 'moment'
import { AlertInterval } from '../../enums'

export const AlertTable = (): JSX.Element => {
  const { alerts, loadAlerts } = useAlertsContext()

  const getIntervalTag = (alert: Alert): JSX.Element => {
    return (
      <Tag color={alert.Interval === 'daily' ? 'blue' : 'red'}>
        {alert.Interval}
      </Tag>
    )
  }

  const getChannelTag = (alert: Alert): JSX.Element => {
    return (
      <Tag color={alert.Channel === 'email' ? 'green' : 'orange'}>
        {alert.Channel}
      </Tag>
    )
  }

  const getAlertDescription = (alert: Alert) => {
    let msg = `${alert.Criteria}`

    if (alert.Criteria === 'between') {
      msg += ` ${alert.Minimum}-${alert.Minimum}`
    } else {
      msg += ` ${alert.Value}`
    }
    msg += ` ${alert.Metric}`
    return msg
  }

  const handleDelete = async (val: number) => {
    try {
      await deleteAlert(val)
      await loadAlerts()
      notification.success({
        message: 'Alert deleted',
        placement: 'bottomRight',
      })
    } catch (e) {
      notification.error({
        message: 'Failed to Delete Alert',
        placement: 'bottomRight',
      })
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: 'Description',
      dataIndex: 'ID',
      key: 'description',
      render: (val: number, alert: Alert) => {
        return (
          <div style={{ maxWidth: 550, display: 'flex' }}>
            {getIntervalTag(alert)}
            {getChannelTag(alert)}
            {alert.Interval !== AlertInterval.IMMEDIATE ? (
              <>
                <Typography.Text type={'secondary'}>@ &nbsp;</Typography.Text>
                <Typography.Text>
                  {moment(alert?.NotifyTime).format('h:mm a')}
                </Typography.Text>
              </>
            ) : (
              <>
                <Typography.Text type={'secondary'}>when</Typography.Text>
                <span>&nbsp;</span>
                <Tooltip title={alert?.Gage?.Name || 'Gage Name'}>
                  <Typography.Text ellipsis>
                    {alert?.Gage?.Name || 'Gage Name'}
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
      title: 'Last Sent',
      dataIndex: 'LastSent',
      key: 'LastSent',
      render: (val: Date) => {
        if (!val) return '-'

        const result = moment(val).format('llll')

        if (result === 'Sun, Dec 31, 0000 5:00 PM') return '-'

        return result
      },
    },
    {
      dataIndex: 'Active',
      key: 'Active',
      render: (active: boolean, alert: Alert) => (
        <Switch
          checked={active}
          onChange={async (Active) => {
            await updateAlert({
              ...alert,
              Active,
            })
            await loadAlerts()
          }}
        />
      ),
    },
    {
      dataIndex: 'ID',
      key: 'ID',
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

  return <Table columns={columns} dataSource={alerts} />
}
