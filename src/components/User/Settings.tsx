import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Modal,
  notification,
  Typography,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { UserUpdateDto } from '../../types'
import { timezones } from '../../lib'
import { deleteUser, updateUser } from '../../controllers'
import debounce from 'lodash.debounce'
import { useLocalNavGuard } from '../../hooks'
import { useUserContext } from './UserContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Settings = () => {
  useLocalNavGuard()
  const { t } = useTranslation()
  const { user } = useUserContext()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('')
  const navigate = useNavigate()
  // these default values are problematic...
  const [userConfig, setUserConfig] = useState<UserUpdateDto>({
    id: 0,
    email: '',
    name: '',
    timezone: '',
    telephone: '',
  })

  const handleValueChange = debounce(async (val: any) => {
    if (!user) return
    try {
      const payload = Object.assign({}, userConfig, val)
      setUserConfig(payload)
      await updateUser(payload)
      notification.success({
        message: t('settingsUpdated'),
        placement: 'bottomRight',
      })
    } catch (e) {
      console.error(e)
      notification.error({
        message: t('failedToAction', { action: t('updateSettings') }),
        placement: 'bottomRight',
      })
    }
  }, 750)

  const deleteConfirmed = deleteConfirmInput === user?.email

  const handleDelete = async () => {
    if (!deleteConfirmed) return
    try {
      await deleteUser(user.id)
      notification.success({
        message: t('entityDeleted', { entity: t('account') }),
        placement: 'bottomRight',
      })
      setDeleteConfirmInput('')
      setDeleteModalVisible(false)
      navigate('/auth/logout', { replace: true })
    } catch (e) {
      console.error(e)
      setDeleteConfirmInput('')
      setDeleteModalVisible(false)
      notification.error({
        message: t('failedToAction', { action: t('deleteAccount') }),
        placement: 'bottomRight',
      })
    }
  }

  useEffect(() => {
    if (user && !userConfig.id) {
      setUserConfig({
        id: user.id,
        email: user.email,
        name: user.name,
        timezone: user.timezone,
        telephone: user.telephone,
      })
    }
  }, [user])

  if (!user) return null

  return (
    <>
      <Row justify={'center'}>
        <Col span={24} sm={20} md={16} lg={16} xl={10}>
          <Card title={t('account')}>
            <Form
              initialValues={user}
              onValuesChange={handleValueChange}
              layout={'vertical'}
            >
              <Form.Item name={'name'} label={t('name')}>
                <Input />
              </Form.Item>
              <Form.Item name={'email'} label={t('email')}>
                <Input />
              </Form.Item>
              <Form.Item name={'timezone'} label={t('timeZone')}>
                <Select>
                  {timezones.map((tz) => (
                    <Select.Option value={tz} key={tz}>
                      {tz}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={'telephone'}
                label={t('telephone')}
                help={t('telephoneHelpText')}
              >
                <Input />
              </Form.Item>
            </Form>
            <Divider />
            <Button
              size={'small'}
              danger
              onClick={() => setDeleteModalVisible(true)}
            >
              {t('deleteAccount')}
            </Button>
          </Card>
        </Col>
      </Row>
      <Modal
        visible={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false)
          setDeleteConfirmInput('')
        }}
        okButtonProps={{
          danger: true,
          disabled: !deleteConfirmed,
        }}
        okText={t('deleteAccount')}
        cancelText={t('cancel')}
        onOk={handleDelete}
      >
        <div style={{ maxWidth: '80%' }}>
          <Typography.Title level={4}>Are you sure?</Typography.Title>
          <Typography.Text>
            {t('pleaseEnterYourEmailtoConfirm')}: <b>{user.email}</b>
          </Typography.Text>
          <Input
            style={{ marginBottom: 16, marginTop: 16 }}
            onChange={({ target }) => {
              setDeleteConfirmInput(target.value)
            }}
          />
        </div>
      </Modal>
    </>
  )
}

export default Settings
