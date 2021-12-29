import {
  AutoComplete,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Statistic,
  Table,
  Tag,
  TimePicker,
  Tooltip,
} from 'antd'
import {
  CreateNotificationDto,
  Gage,
  Notification,
  NotificationChannel,
  NotificationCriteria,
  NotificationInterval,
  GageReadingMetric,
  User,
  UpdateNotificationDto,
} from 'types'
import { useState } from 'react'
import {
  createNotification,
  deleteNotification,
} from '../../controllers/notification'
import moment from 'moment'

interface NotificationsProps {
  user: User
  notifications: Notification[]
  userGages: Gage[]
  userTimezone: string
  userVerified: boolean
}

const defaultForm: CreateNotificationDto = {
  criteria: NotificationCriteria.ABOVE,
  gageDisabled: false,
  metric: GageReadingMetric.CFS,
  channel: NotificationChannel.EMAIL,
  interval: NotificationInterval.DAILY,
  name: '',
  alertTime: new Date(),
  userId: 0,
  gageId: 1,
  primary: false,
  minimum: 0,
  maximum: 0,
}

export const UserReports = (props: NotificationsProps) => {
  const { user, notifications, userGages, userVerified, userTimezone } = props
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [options, setOptions] = useState<{ label: string; value: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [notificationForm, setNotificationForm] =
    useState<CreateNotificationDto>(defaultForm)
  const [tableData, setTableData] = useState<any[]>([...notifications])
  const [updateNotificationForm, setUpdateNotificationForm] =
    useState<UpdateNotificationDto>()

  const handleRemoveNotification = async (
    id: number,
    notification: Notification,
  ) => {
    try {
      await deleteNotification(id, notification.gages[0].id)
      setTableData(tableData.filter((el) => el.id !== id))
      message.success('Report Deleted')
    } catch (e) {
      console.log('e', e)
      message.error('Failed to Delete Report')
    }
  }

  const handleOk = async () => {
    try {
      setConfirmLoading(true)
      const result = await createNotification({
        ...notificationForm,
        userId: user.id,
        // alertTime: moment(notificationForm.alertTime).toDate(),
      })
      setTableData([...tableData, result])
      setNotificationForm(defaultForm)
      setModalVisible(false)
      message.success('Report Created')
    } catch (e) {
      message.error('something failed...')
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleCancel = () => {
    setModalVisible(false)
    setUpdateNotificationForm(undefined)
    setNotificationForm(defaultForm)
  }

  const initiateEdit = (report: Notification) => {
    setUpdateNotificationForm(report)
    setModalVisible(true)
  }

  const onSearch = async (evt: string) => {
    const results = userGages
      .filter((val: Gage) => val.name.toLowerCase().includes(evt.toLowerCase()))
      .map((gage) => ({
        value: gage.id,
        label: gage.name,
      }))
    setOptions(results)
  }

  const onSelect = (value: string) => {
    setNotificationForm({ ...notificationForm, gageId: parseInt(value, 10) })
  }

  const getNotificationDescription = (notification: Notification) => {
    if (notification.interval !== 'IMMEDIATE') {
      return (
        <>
          <Tooltip title="Interval">
            <Tag color="cyan">{notification.interval}</Tag>
          </Tooltip>
          <Tooltip title="Channel">
            <Tag color={notification.channel === 'SMS' ? 'magenta' : 'green'}>
              {notification.channel}
            </Tag>
          </Tooltip>
          <span style={{ marginRight: 8 }}>@</span>
          <Tooltip title="Send Time">
            <Tag>{moment(notification.alertTime).format('hh:mm:ss a')}</Tag>
          </Tooltip>
        </>
      )

      // return `${notification.interval} ${notification.channel} @ ${moment(
      //   notification.alertTime
      // ).format("hh:mm:ss a")}`;
    } else {
      return `${notification.interval} ${notification.channel} when ${notification.gages[0].name} ${notification.criteria} ${notification.minimum} ${notification.metric}`
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (val: string) => val || 'Untitled',
    },
    {
      title: 'Description',
      dataIndex: 'id',
      key: 'id',
      render: (id: number, val: Notification) =>
        getNotificationDescription(val),
    },
    {
      title: 'Last Sent',
      dataIndex: 'lastSent',
      key: 'lastSent',
      render: (val: Date) => (val ? moment(val).format('llll') : 'Never'),
    },
    {
      dataIndex: 'id',
      key: 'id',
      render: (id: number, val: Notification) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            size={'small'}
            danger
            onClick={() => handleRemoveNotification(id, val)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const getHelpText = () => {
    switch (notificationForm.interval) {
      case 'IMMEDIATE':
        return 'Get notified as soon as the gage is updated.'
      case 'DAILY':
        return 'Full overview of all your gage bookmarks'
    }
  }

  const getTooltipText = () => {
    // !userVerified || !userGages.length || tableData.length >= 5

    let text = ''

    if (!userVerified) {
      text += 'Please verify your email '
    }

    if (!userGages.length) {
      text += 'Gage Bookmark Required '
    }

    if (tableData.length >= 5) {
      text += 'Report Limit Reached'
    }

    return text
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 24,
              }}
            >
              <Statistic value={userTimezone} title="Timezone" />
              {!userVerified || !userGages.length || tableData.length >= 5 ? (
                <Tooltip title={getTooltipText()}>
                  <Button disabled type="primary">
                    Add Report
                  </Button>
                </Tooltip>
              ) : (
                <Button type="primary" onClick={() => setModalVisible(true)}>
                  Add Report
                </Button>
              )}
            </div>
            <div
              style={{ maxWidth: '100%', width: '100%', overflowX: 'scroll' }}
            >
              <Table
                columns={columns}
                dataSource={tableData}
                loading={loading}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        title="Create Report"
        visible={modalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form
          initialValues={
            updateNotificationForm ? updateNotificationForm : notificationForm
          }
          onValuesChange={(evt) => {
            if (updateNotificationForm) {
              setUpdateNotificationForm(
                Object.assign({}, updateNotificationForm, evt),
              )
            } else {
              setNotificationForm(Object.assign({}, notificationForm, evt))
            }
          }}
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item name="interval" label="Interval" help={getHelpText()}>
            <Select>
              <Select.Option value="IMMEDIATE">Immediate</Select.Option>
              <Select.Option value="DAILY">Daily</Select.Option>
              <Select.Option disabled value="WEEKLY">
                Weekly
              </Select.Option>
              <Select.Option disabled value="MONTHLY">
                Monthly
              </Select.Option>
              <Select.Option disabled value="YEARLY">
                Yearly
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Gage"
            name="gage"
            hidden={notificationForm.interval === 'DAILY'}
          >
            <AutoComplete
              options={options}
              style={{ width: 200 }}
              onSelect={onSelect}
              onSearch={onSearch}
              placeholder="Animas River ..."
            />
          </Form.Item>
          <Form.Item name="channel" label="Channel">
            <Select>
              <Select.Option value={NotificationChannel.EMAIL}>
                Email
              </Select.Option>
              <Select.Option
                value={NotificationChannel.SMS}
                disabled={!user.verified || !user.telephone}
              >
                SMS
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="alertTime"
            label="Notificaton Time"
            hidden={
              notificationForm.interval === NotificationInterval.IMMEDIATE
            }
          >
            <TimePicker format="HH:mm" minuteStep={30} />
          </Form.Item>
          <Form.Item
            name="criteria"
            label="Criteria"
            hidden={notificationForm.interval === NotificationInterval.DAILY}
          >
            <Select>
              <Select.Option value="ABOVE">Above</Select.Option>
              <Select.Option value="BELOW">Below</Select.Option>
              <Select.Option value="BETWEEN">Between</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="minimum"
            label="Minimum"
            hidden={notificationForm.interval === NotificationInterval.DAILY}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="maximum"
            label="Maximum"
            hidden={notificationForm.interval === NotificationInterval.DAILY}
          >
            <InputNumber
              min={notificationForm.minimum}
              disabled={notificationForm.criteria !== 'BETWEEN'}
            />
          </Form.Item>
          <Form.Item
            name="metric"
            label="Metric"
            hidden={notificationForm.interval === NotificationInterval.DAILY}
          >
            <Select>
              <Select.Option value={GageReadingMetric.CFS}>CFS</Select.Option>
              <Select.Option value={GageReadingMetric.FT}>Ft</Select.Option>
              <Select.Option value={GageReadingMetric.CMS}>CMS</Select.Option>
              <Select.Option value={GageReadingMetric.TEMP}>Temp</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
