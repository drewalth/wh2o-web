import { ReactNode, useState } from 'react'
import { Form, Input, Modal, InputNumber, Select, Switch } from 'antd'
import {
  Feature,
  FeatureCreateDto,
  FeatureUpdateDto,
  RequestStatus,
} from '../../../../types'
import { useTranslation } from 'react-i18next'
import { createFeature, updateFeature } from '../../../../controllers'
import { notify } from '../../../../lib'
import { useReachDetailContext } from '../ReachDetailContext'
import { GradeRating } from '../../../../enums'

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
  const { reach } = useReachDetailContext()
  const DEFAULT_CREATE_FORM: FeatureCreateDto = {
    accessPoint: false,
    campsite: false,
    description: '',
    distance: 0,
    hazard: false,
    latitude: 0,
    longitude: 0,
    name: '',
    poi: false,
    putIn: false,
    rangerStation: false,
    rapid: true,
    reachId: reach?.id || '',
    surf: false,
    takeOut: false,
    waterfall: false,
    grade: '-',
  }
  const { t } = useTranslation()
  const [form, setForm] = useState<FeatureCreateDto | FeatureUpdateDto>(
    feature ? feature : DEFAULT_CREATE_FORM,
  )
  const [requestStatus, setRequestStatus] = useState<RequestStatus>()

  const reachLength = reach?.length || 0

  const handleValueChange = (val) => setForm(Object.assign({}, form, val))

  const submitRequest = feature ? updateFeature : createFeature
  const successMsg = feature ? 'Feature updated' : 'Feature created'
  const errorMsg = feature
    ? 'Failed to update feature'
    : 'Failed to create feature'

  const handleSubmit = async () => {
    try {
      setRequestStatus('loading')

      // @ts-ignore
      await submitRequest(form)

      setRequestStatus('success')
      notify.success(successMsg)

      onSuccess()
    } catch (e) {
      setRequestStatus('failure')
      notify.error(errorMsg)
    }
  }

  const getCharacteristicInputs = () => {
    const elements: ReactNode[] = []

    for (const i in DEFAULT_CREATE_FORM) {
      if (typeof DEFAULT_CREATE_FORM[i] === 'boolean') {
        elements.push(
          <Form.Item name={i} label={t(i)}>
            <Switch checked={form[i]} />
          </Form.Item>,
        )
      }
    }

    return elements
  }

  return (
    <Modal
      title={feature ? 'Edit Feature' : 'Add Feature'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={requestStatus === 'loading'}
      destroyOnClose
      okText={t('submit')}
      cancelText={t('cancel')}
      bodyStyle={{ maxHeight: '50vh', overflowY: 'scroll' }}
    >
      <Form
        initialValues={form}
        onValuesChange={handleValueChange}
        layout={'vertical'}
      >
        <Form.Item name={'name'} label={t('name')} required>
          <Input />
        </Form.Item>
        <Form.Item name={'distance'} label={t('distance')} required>
          <InputNumber max={reach ? reachLength : undefined} step={0.1} />
        </Form.Item>
        <Form.Item name={'grade'} label={t('grade')}>
          <Select>
            {['-', ...Object.values(GradeRating)].map((rt) => (
              <Select.Option key={rt} value={rt}>
                {rt}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {getCharacteristicInputs().map((el) => el)}
        <Form.Item name={'description'} label={t('description')}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}
