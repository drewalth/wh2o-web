import { useState } from 'react'
import { Form, Input, Modal, Select } from 'antd'
import {
  Feature,
  MediaCreateDto,
  MediaType,
  RequestStatus,
} from '../../../../types'
import { useTranslation } from 'react-i18next'
import { UploadFile } from './UploadFile'
import { notify } from '../../../../lib'
import { createMedia } from '../../../../controllers'

export type CreateMediaModalProps = {
  visible: boolean
  onCancel: () => void
  reachId: number
  userId: number
  onSuccess: () => Promise<void>
  features: Feature[]
}

export const CreateMediaModal = ({
  visible,
  onCancel,
  reachId,
  userId,
  onSuccess,
  features,
}: CreateMediaModalProps) => {
  const DEFAULT_FORM: MediaCreateDto = {
    type: MediaType.IMAGE,
    title: '',
    subTitle: '',
    description: '',
    reachId,
    userId,
    url: '',
  }

  const [requestStatus, setRequestStatus] = useState<RequestStatus>()
  const [form, setForm] = useState<MediaCreateDto>(DEFAULT_FORM)
  const { t } = useTranslation()

  const handleValueChange = (val: any) => {
    if (val.type && val.type !== form.type) {
      setForm(Object.assign({}, form, { ...val, url: '' }))
    } else {
      setForm(Object.assign({}, form, val))
    }
  }

  const handleSubmit = async () => {
    try {
      if (!userId || !reachId) {
        console.error('missing props')
        return
      }

      setRequestStatus('loading')
      const result = await createMedia(form)

      console.log(result)

      setRequestStatus('success')
      notify.success('Media created')
      await onSuccess()
    } catch (e) {
      console.error(e)
      notify.error('failed to create media')
      setRequestStatus('failure')
    }
  }

  return (
    <Modal
      visible={visible}
      title={'Add Media'}
      okText={t('submit')}
      destroyOnClose
      onCancel={onCancel}
      cancelText={t('cancel')}
      onOk={handleSubmit}
      confirmLoading={requestStatus === 'loading'}
    >
      <Form
        onValuesChange={handleValueChange}
        layout={'vertical'}
        initialValues={DEFAULT_FORM}
      >
        <Form.Item label={t('mediaType')} name={'type'}>
          <Select>
            {Object.values(MediaType).map((mt) => (
              <Select.Option key={mt} value={mt}>
                {mt}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t('title')} name={'title'} required>
          <Input />
        </Form.Item>
        <Form.Item label={t('subTitle')} name={'subTitle'}>
          <Input />
        </Form.Item>
        <Form.Item label={t('description')} name={'description'}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label={t('feature')}
          name={'featureId'}
          hidden={features.length === 0}
        >
          <Select>
            {features.length > 0 &&
              features.map((ft) => (
                <Select.Option key={ft.id} value={ft.id}>
                  {ft.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          hidden={
            form.type === MediaType.VIMEO || form.type === MediaType.YOUTUBE
          }
        >
          <UploadFile
            type={form.type}
            onSuccess={(url: string) => setForm({ ...form, url })}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
