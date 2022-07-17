import { useState } from 'react'
import { Form, Input, Modal } from 'antd'
import { Feature, RequestStatus } from '../../../../types'
import { useTranslation } from 'react-i18next'
import { updateFeature } from '../../../../controllers'
import { notify } from '../../../../lib'

export type FeatureEditModalProps = {
  feature?: Feature
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
}

export const FeatureEditModal = ({
  feature,
  visible,
  onCancel,
  onSuccess,
}: FeatureEditModalProps) => {
  const { t } = useTranslation()
  const [form, setForm] = useState<Feature>()
  const [requestStatus, setRequestStatus] = useState<RequestStatus>()

  const handleValueChange = (val) => setForm(Object.assign({}, form, val))

  const handleSubmit = async () => {
    try {
      setRequestStatus('loading')

      // @ts-ignore
      const result = await updateFeature(form)
      console.log('result: ', result)

      setRequestStatus('success')
      notify.success('feaure updated')

      onSuccess()
    } catch (e) {
      setRequestStatus('failure')
      notify.error('failed to update feature')
    }
  }

  return (
    <Modal
      title={'Edit Feature'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={requestStatus === 'loading'}
      destroyOnClose
      okText={t('submit')}
      cancelText={t('cancel')}
    >
      <Form
        initialValues={feature}
        onValuesChange={handleValueChange}
        layout={'vertical'}
      >
        <Form.Item name={'name'} label={t('name')}>
          <Input></Input>
        </Form.Item>
      </Form>
    </Modal>
  )
}
