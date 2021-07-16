import { Timezone, UpdateUserDto, User, UserModel } from 'interfaces'
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
  Select,
  Spin,
  AutoComplete,
} from 'antd'
import { useEffect, useState } from 'react'
import { useAppDispatch } from 'store'
import { fetchUser, resetUser } from 'store/slices/user.slice'
import { deleteUser, updateUser } from 'controllers'
import { useRouter } from 'next/router'
import { getTimezones } from '../../controllers/timezones'
import debounce from 'lodash.debounce'
import { CheckCircleTwoTone } from '@ant-design/icons'

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
  const [updateLoading, setUpdateLoading] = useState(false)
  const [timezones, setTimezones] = useState<Timezone[]>([])
  const [userForm, setUserForm] = useState<UpdateUserDto>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    timezone: user.timezone,
  })

  const [options, setOptions] = useState<{ value: string }[]>([])
  const onSearch = (searchText: string) => {
    setOptions(
      !searchText
        ? timezones.map((tz) => ({ value: tz.tzCode }))
        : timezones
            .filter((tz) =>
              tz.tzCode.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((el) => ({ value: el.tzCode }))
    )
  }

  const loadTimezones = async () => {
    try {
      const results = await getTimezones()
      setTimezones(results)
    } catch (e) {
      console.log('e', e)
      message.error('Timezones failed to load')
    }
  }

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

  const handleUpdate = async () => {
    try {
      if (!timezones.map((tz) => tz.tzCode).includes(userForm.timezone)) return
      setUpdateLoading(true)
      const result = await updateUser(user.id, userForm)

      if (result) {
        dispatch(fetchUser(user.id))
      }
    } catch (e) {
      console.log('e', e)
      message.error('Failed to Update')
    } finally {
      setUpdateLoading(false)
    }
  }

  useEffect(() => {
    if (
      JSON.stringify(userForm) !==
      JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        timezone: user.timezone,
      })
    ) {
      handleUpdate()
    }
  }, [userForm])

  useEffect(() => {
    loadTimezones()
  }, [])

  return (
    <>
      <Row>
        <Col span={24}>
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 8,
              }}
            >
              {updateLoading ? (
                <Spin />
              ) : (
                <CheckCircleTwoTone twoToneColor="#52c41a" />
              )}
            </div>
            <Form
              initialValues={userForm}
              onValuesChange={debounce(
                (evt) => setUserForm(Object.assign({}, userForm, evt)),
                500
              )}
            >
              <Form.Item name="firstName" label="First Name">
                <Input />
              </Form.Item>
              <Form.Item name="lastName" label="Last Name">
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" required>
                <Input />
              </Form.Item>
              <Form.Item name="timezone" label="Timezone" required>
                <AutoComplete
                  options={options}
                  style={{ width: 200 }}
                  onSearch={onSearch}
                  placeholder="America/Denver"
                />
              </Form.Item>
            </Form>
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
