import { AutoComplete, Button, Card, Col, Form, Modal, Row, Table } from 'antd'
import { Gage, Notification, NotificationCriteria } from 'interfaces'
import moment from 'moment'
import { useState } from 'react'

interface NotificationsProps {
  userId: number
  notifications: Notification[]
  userGages: Gage[]
}

export const Notifications = (props: NotificationsProps) => {
  const { userId, notifications, userGages } = props
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [options, setOptions] = useState<{ label: string; value: number }[]>([])
  const [loading, setLoading] = useState(false)

  const handleRemoveNotification = async (id: number) => {
    console.log('remove')
  }

  const handleOk = () => {
    console.log('ok')
  }

  const handleCancel = () => {
    setModalVisible(false)
  }

  const onSearch = async (evt: string) => {
    console.log('evt', evt)

    const results = [...userGages]
      .filter((val: Gage) => val.name.toLowerCase().includes(evt.toLowerCase()))
      .map((gage) => ({
        value: gage.id,
        label: gage.name,
      }))
    setOptions(results)
  }

  const onSelect = () => {
    console.log('gage select')
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Criteria',
      dataIndex: 'criteria',
      key: 'criteria',
      render: (criteria: NotificationCriteria, val: Notification) => (
        <span>{criteria}</span>
      ),
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt: Date, val: Notification) => (
        <span>
          {!updatedAt
            ? moment(val.createdAt).format('LL')
            : moment(updatedAt).format('LL')}
        </span>
      ),
    },
    {
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button danger onClick={() => handleRemoveNotification(id)}>
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
                justifyContent: 'flex-end',
                marginBottom: 24,
              }}
            >
              <Button type="primary" onClick={() => setModalVisible(true)}>
                Add Notification
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={notifications}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
      <Modal
        title="Bookmark Gage"
        visible={modalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item label="Gage Name" name="gage" rules={[{ required: true }]}>
            <AutoComplete
              options={options}
              style={{ width: 200 }}
              onSelect={onSelect}
              onSearch={onSearch}
              placeholder="input here"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
