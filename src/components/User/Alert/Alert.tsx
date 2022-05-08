import React, { useState } from 'react'
import { AlertTable } from './AlertTable'
import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Select,
  TimePicker,
  Tooltip,
} from 'antd'
import { CreateAlertDto, GageMetric, RequestStatus } from '../../../types'
import { AlertChannel, AlertCriteria, AlertInterval } from '../../../enums'
import { createAlert } from '../../../controllers'
import moment from 'moment'
import { useUserContext } from '../UserContext'
import { useTranslation } from 'react-i18next'

const defaultCreateForm: CreateAlertDto = {
  name: '',
  value: 1.0,
  active: true,
  criteria: AlertCriteria.ABOVE,
  channel: AlertChannel.EMAIL,
  interval: AlertInterval.DAILY,
  notifyTime: undefined,
  metric: GageMetric.CFS,
  minimum: 1.0,
  maximum: 1.0,
  userId: 0,
  gageId: 1,
}

export const Alert = (): JSX.Element => {
  const { user, reload } = useUserContext()
  const { t } = useTranslation()
  const userUnverified = user && !user.verified
  const userHasAlertLimit = user && user.verified && user.alerts.length >= 15
  const addTooltipMessage = userUnverified
    ? t('pleaseVerifyYourAccount')
    : t('maximumNumberOfAlertsCreated')
  const addAlertButtonDisabled = userUnverified || userHasAlertLimit

  const [modalVisible, setModalVisible] = useState(false)
  const [createForm, setCreateForm] =
    useState<CreateAlertDto>(defaultCreateForm)
  const [requestStatus, setRequestStatus] = useState<RequestStatus>()

  const handleOk = async () => {
    try {
      if (!user) return
      setRequestStatus('loading')
      const notifyTime = moment(createForm.notifyTime).format(
        'YYYY-MM-DDTHH:mm:ss',
      )
      await createAlert({
        ...createForm,
        value: Number(createForm.value),
        userId: user.id,
        notifyTime,
      })
      // appendUserAlerts(result)
      await reload()
      setRequestStatus('success')
      notification.success({
        message: t('entityCreateSuccess', { entity: t('alert') }),
        placement: 'bottomRight',
      })
    } catch (e) {
      setRequestStatus('failure')
      notification.error({
        message: t('entityCreateError', { entity: t('alert') }),
        placement: 'bottomRight',
      })
    } finally {
      setModalVisible(false)
      setCreateForm({ ...defaultCreateForm })
    }
  }

  const handleCancel = () => {
    setModalVisible(false)
    setCreateForm({ ...defaultCreateForm })
  }

  return (
    <>
      <Modal
        visible={modalVisible}
        destroyOnClose={true}
        title={t('addEntity', { entity: t('alert') })}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={requestStatus === 'loading'}
        okText={t('ok')}
        cancelText={t('cancel')}
      >
        <Form
          layout={'vertical'}
          wrapperCol={{
            span: 23,
          }}
          onValuesChange={(evt) =>
            setCreateForm(Object.assign({}, createForm, evt))
          }
          initialValues={defaultCreateForm}
        >
          <Form.Item name={'name'} label={t('name')}>
            <Input />
          </Form.Item>

          <Form.Item name={'interval'} label={t('interval')}>
            <Select>
              {Object.values(AlertInterval).map((interval) => (
                <Select.Option key={interval} value={interval}>
                  {t(interval.toLocaleLowerCase())}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={'channel'} label={t('channel')}>
            <Select>
              {Object.values(AlertChannel).map((el) => (
                <Select.Option
                  key={el}
                  value={el}
                  disabled={
                    el === AlertChannel.SMS &&
                    createForm.interval === AlertInterval.DAILY
                  }
                >
                  {t(el.toLocaleLowerCase())}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={'gageID'}
            label={t('gage')}
            hidden={createForm.interval === AlertInterval.DAILY}
          >
            <Select>
              {user?.gages.map((gage) => (
                <Select.Option key={gage.siteId} value={gage.id}>
                  {gage.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={'notifyTime'}
            label={t('time')}
            hidden={createForm.interval === AlertInterval.IMMEDIATE}
          >
            <TimePicker
              use12Hours
              format="h:mm a"
              minuteStep={5}
              placeholder={t('selectTime')}
            />
          </Form.Item>
          <Form.Item
            name={'criteria'}
            label={t('criteria')}
            hidden={createForm.interval === 'DAILY'}
          >
            <Select>
              {Object.values(AlertCriteria).map((el) => (
                <Select.Option key={el} value={el}>
                  {t(el.toLocaleLowerCase())}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={'value'}
            label={t('value')}
            hidden={
              createForm.interval === 'DAILY' ||
              createForm.criteria === 'BETWEEN'
            }
          >
            <Input type={'number'} />
          </Form.Item>
          <Form.Item
            name={'minimum'}
            label={t('minimum')}
            hidden={
              createForm.interval === 'DAILY' ||
              createForm.criteria !== 'BETWEEN'
            }
          >
            <Input type={'number'} max={createForm.maximum} />
          </Form.Item>
          <Form.Item
            name={'maximum'}
            label={t('maximum')}
            hidden={
              createForm.interval === 'DAILY' ||
              createForm.criteria !== 'BETWEEN'
            }
          >
            <Input type={'number'} min={createForm.minimum} />
          </Form.Item>
          <Form.Item
            name={'metric'}
            label={t('metric')}
            hidden={createForm.interval === 'DAILY'}
          >
            <Select>
              {Object.values(GageMetric).map((el) => (
                <Select.Option key={el} value={el}>
                  {el}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 24,
        }}
      >
        {addAlertButtonDisabled ? (
          <Tooltip title={addTooltipMessage} placement={'top'}>
            <Button type={'primary'} disabled={addAlertButtonDisabled}>
              Add Alert
            </Button>
          </Tooltip>
        ) : (
          <Button type={'primary'} onClick={() => setModalVisible(true)}>
            Add Alert
          </Button>
        )}
      </div>
      <AlertTable />
    </>
  )
}
