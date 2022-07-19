import { Form, Input, Modal } from 'antd'
import { useTranslation } from 'react-i18next'

export type FeatureCreateModalProps = {
  visible: boolean
  onCancel: () => void
  onSuccess: () => Promise<void>
}

export const FeatureCreateModal = ({
  visible,
  onCancel,
}: FeatureCreateModalProps) => {
  const { t } = useTranslation()

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title={t('addEntity', { entity: t('feature') })}
    >
      <Form layout={'vertical'}>
        <Form.Item label={t('name')} name={'name'}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
