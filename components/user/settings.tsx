import {User, UserModel} from 'interfaces'
import {
  Row,
  Col,
  Card,
  Modal,
  Button,
  Form,
  Input,
  Typography,
  message,
} from 'antd'
import { useState } from 'react'
import { useAppDispatch } from 'store'
import { resetUser } from 'store/slices/user.slice'
import { deleteUser } from 'controllers'
import { useRouter } from 'next/router'

interface SettingsProps {
  user: User
}

export const Settings = (props: SettingsProps) => {
  const { user } = props
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmInput, setConfirmInput] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      if (!user.id) return
      setDeleteLoading(true)
      const result = await deleteUser(user.id)
      if (result) {
        setDeleteLoading(false)
        setModalVisible(false)
        message.success('Account Deleted.')
        localStorage.removeItem('wh2o-auth-token')
        dispatch(resetUser(UserModel))
        await router.push('/')
      }
    } catch (e) {
      console.log('e', e)
      message.error('Failed to delete account.')
    }
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <Card>
            <Typography.Title level={5} editable>
              {user.email}
            </Typography.Title>
            <Button
              style={{ marginTop: 24 }}
              danger
              onClick={() => setModalVisible(true)}
            >
              Delete Account
            </Button>
          </Card>
        </Col>
      </Row>
      <Modal
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        visible={modalVisible}
        confirmLoading={deleteLoading}
        destroyOnClose
        okButtonProps={{ disabled: confirmInput !== user.email }}
      >
        <Typography.Title>Are you sure?</Typography.Title>
        <Typography.Text>
          Please confirm account deletion by typing email:{' '}
          <strong>{user.email}</strong>
        </Typography.Text>
        <Form
          style={{ marginTop: 24 }}
          initialValues={{ confirmEmail: '' }}
          onValuesChange={({ val }) => setConfirmInput(val)}
        >
          <Form.Item name="val">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
