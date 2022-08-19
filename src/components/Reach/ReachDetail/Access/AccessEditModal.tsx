import { Input, Form, Modal } from 'antd'
import { Reach, RequestStatus } from '../../../../types'
import { useState } from 'react'
import { notify } from '../../../../lib'
import { updateReach } from '../../../../controllers'
import { useTranslation } from 'react-i18next'

export type AccessEditModalProps = {
  reach: Reach
  onSuccess: () => Promise<void>
  visible: boolean
  onCancel: () => void
}

export const AccessEditModal = ({
  reach,
  onSuccess,
  visible,
  onCancel,
}: AccessEditModalProps) => {
  const { t } = useTranslation()
  const [form, setForm] = useState<Reach>(reach)
  const [requestStatus, setRequestStatus] = useState<RequestStatus>()

  const handleSubmit = async () => {
    try {
      setRequestStatus('loading')
      await updateReach(reach.id, form)
      setRequestStatus('success')
      notify.success('Access edited')
      await onSuccess()
    } catch (e) {
      setRequestStatus('failure')
      notify.error('Failed to edit access')
    }
  }

  return (
    <Modal
      title={'Edit Access'}
      onOk={handleSubmit}
      confirmLoading={requestStatus === 'loading'}
      okText={t('submit')}
      cancelText={t('cancel')}
      visible={visible}
      onCancel={onCancel}
    >
      <Form
        initialValues={form}
        onValuesChange={({ access }) => setForm({ ...form, access })}
      >
        <Form.Item name={'access'}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}
