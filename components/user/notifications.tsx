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
} from 'antd'
import {
  CreateNotificationDto,
  Gage,
  Notification,
  NotificationChannel,
  NotificationCriteria,
  NotificationInterval,
  ReadingMetric,
} from 'interfaces'
import moment from 'moment'
import { useState } from 'react'
import {
  createNotification,
  deleteNotification,
} from '../../controllers/notification'

interface NotificationsProps {
  userId: number
  notifications: Notification[]
  userGages: Gage[]
}

const defaultForm = {
  criteria: NotificationCriteria.ABOVE,
  gageDisabled: false,
  metric: ReadingMetric.CFS,
  channel: NotificationChannel.EMAIL,
  interval: NotificationInterval.DAILY,
  name: '',
  userId: 0,
  gageId: 0,
  primary: false,
  minimum: 0,
  maximum: 0,
}

export const Notifications = (props: NotificationsProps) => {
  const { userId, notifications, userGages } = props
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [options, setOptions] = useState<{ label: string; value: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [notificationForm, setNotificationForm] =
    useState<CreateNotificationDto>(defaultForm)
  const [tableData, setTableData] = useState<any[]>([...notifications])

  const handleRemoveNotification = async (
    id: number,
    notification: Notification
  ) => {
    try {
      console.log(id)
      console.log(notification)
      await deleteNotification(id, notification.gages[0].id)
      setTableData(tableData.filter((el) => el.id !== id))
      message.success('Notification deleted')
    } catch (e) {
      console.log('e', e)
      message.error('failed to delete notification')
    }
  }

  const handleOk = async () => {
    try {
      setConfirmLoading(true)
      const result = await createNotification({ ...notificationForm, userId })
      setTableData([...tableData, result])
      setNotificationForm(defaultForm)
      setModalVisible(false)
      message.success('notification created')
    } catch (e) {
      message.error('something failed...')
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleCancel = () => {
    setModalVisible(false)
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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Gage',
      dataIndex: 'gageId',
      key: 'gageId',
    },
    {
      title: 'Criteria',
      dataIndex: 'criteria',
      key: 'criteria',
      render: (criteria: NotificationCriteria, val: Notification) => (
        <span>{`${criteria} ${val.minimum} ${
          criteria === 'BETWEEN' ? val.maximum : ''
        }`}</span>
      ),
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      key: 'channel',
    },
    {
      title: 'Interval',
      dataIndex: 'interval',
      key: 'interval',
    },
    {
      title: 'Last Sent',
      dataIndex: 'lastSent',
      key: 'lastSent',
      render: (lastSent: Date, val: Notification) => (
        <span>{lastSent ? moment(lastSent).format('LL') : 'Never'}</span>
      ),
    },
    {
      dataIndex: 'id',
      key: 'id',
      render: (id: number, val: Notification) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button danger onClick={() => handleRemoveNotification(id, val)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

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
              <Row gutter={24}>
                <Col>
                  <Statistic title="Total Sent" value={0} />
                </Col>
                <Col>
                  <Statistic title="Email" value={0} />
                </Col>
                <Col>
                  <Statistic title="SMS" value={0} />
                </Col>
                <Col>
                  <Statistic title="Push" value={0} />
                </Col>
              </Row>
              <Button type="primary" onClick={() => setModalVisible(true)}>
                Add Notification
              </Button>
            </div>
            <Table columns={columns} dataSource={tableData} loading={loading} />
          </Card>
        </Col>
      </Row>
      <Modal
        title="Create Notification"
        visible={modalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          initialValues={notificationForm}
          onValuesChange={(evt) =>
            setNotificationForm(Object.assign({}, notificationForm, evt))
          }
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Gage" name="gage" rules={[{ required: true }]}>
            <AutoComplete
              options={options}
              style={{ width: 200 }}
              onSelect={onSelect}
              onSearch={onSearch}
              placeholder="input here"
            />
          </Form.Item>
          <Form.Item name="channel" label="Channel">
            <Select>
              <Select.Option value="EMAIL">Email</Select.Option>
              <Select.Option value="SMS" disabled>
                SMS
              </Select.Option>
              <Select.Option value="PUSH" disabled>
                Push
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="interval" label="Interval">
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
          <Form.Item name="criteria" label="Criteria">
            <Select>
              <Select.Option value="ABOVE">Above</Select.Option>
              <Select.Option value="BELOW">Below</Select.Option>
              <Select.Option value="BETWEEN">Between</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="minimum" label="Minimum">
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="maximum" label="Maximum">
            <InputNumber
              min={notificationForm.minimum}
              disabled={notificationForm.criteria !== 'BETWEEN'}
            />
          </Form.Item>
          <Form.Item name="metric" label="Metric">
            <Select>
              <Select.Option value="CFS">CFS</Select.Option>
              <Select.Option value="FT">Ft</Select.Option>
              <Select.Option value="CMS">CMS</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
