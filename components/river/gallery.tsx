import { Upload, message, Button, Card, Modal, Form, Input, Select } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { IMedia, MediaModel } from 'interfaces'
import { createMedia, deleteMedia, deletePendingMedia } from 'controllers'
import { useAppSelector } from 'store'
import { selectUserData, selectUserIsPublisher } from 'store/slices/user.slice'

interface GalleryProps {
  apiUrl: string
  awsS3RootPath: string
  sources: IMedia[]
  id: number
}

export const Gallery = (props: GalleryProps) => {
  const [imagePaths, setImagePaths] = useState<IMedia[]>([])
  const [pendingFileName, setPendingFileName] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [form, setForm] = useState<IMedia>({ ...MediaModel })
  const userIsPublisher = useAppSelector(selectUserIsPublisher)
  const user = useAppSelector(selectUserData)

  const handleDelete = async (id: string | number | undefined) => {
    if (!id) return
    try {
      const result = await deleteMedia(id)
      console.log('result', result)
    } catch (e) {
      console.log('e', e)
    }
  }

  const handleCancel = async (hideModal = true) => {
    if (pendingFileName) {
      await deletePendingMedia(pendingFileName)
    }

    if (hideModal) {
      setModalVisible(false)
    }
  }

  const handleOk = async () => {
    try {
      setSaveLoading(true)
      const result = await createMedia({
        ...form,
        fileName: pendingFileName,
        rivers: props.id || undefined,
        // @ts-ignore
        user: {
          connect: {
            id: user.id,
          },
        },
        // features
        // pick from existing or upload new
      })
      setImagePaths([...imagePaths, result])
    } catch (e) {
      console.log(e)
      setSaveError(true)
    } finally {
      if (!saveError) {
        setForm({ ...MediaModel })
        setSaveLoading(false)
        setModalVisible(false)
      }
    }
  }

  const uploadConfig = {
    name: 'file',
    accept: 'image/jpeg, image/gif, image/png',
    action: () => `${props.apiUrl}/aws-s3`,
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`File Uploaded Successfully`)
        setPendingFileName(info.file.response.Key)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }
  return (
    <>
      <Modal
        visible={modalVisible}
        // @ts-ignore antd bug?
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={saveLoading}
      >
        <Form
          onValuesChange={(evt) => setForm(Object.assign(form, evt))}
          name="basic"
          initialValues={{
            title: '',
            description: '',
            rapid: 0,
            entityType: 'photo',
          }}
        >
          {form.entityType === 'photo' && (
            <Form.Item>
              <Upload
                {...uploadConfig}
                style={{ marginBottom: 24 }}
                onRemove={() => handleCancel(false)}
              >
                <Button icon={<UploadOutlined />}>File Upload</Button>
              </Upload>
            </Form.Item>
          )}
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Entity Type" name="entityType">
            <Select
              onSelect={(evt) =>
                setForm(Object.assign({}, form, { entityType: evt }))
              }
            >
              <Select.Option value="photo">File Upload</Select.Option>
              <Select.Option value="youtube">YouTube</Select.Option>
              <Select.Option value="vimeo">Vimeo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Desciption" name="description">
            <Input />
          </Form.Item>
          {['vimeo', 'youtube'].includes(form.entityType) && (
            <Form.Item label="URL" name="url">
              <Input />
            </Form.Item>
          )}
        </Form>
      </Modal>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 24,
        }}
      >
        <Button
          type="primary"
          disabled={!userIsPublisher}
          onClick={() => setModalVisible(true)}
        >
          Add Media
        </Button>
      </div>
      <div>
        {props.sources &&
          [...props.sources, ...imagePaths]
            .filter(
              ({ entityType }: IMedia) =>
                // @ts-ignore
                !['vimeo', 'youtube'].includes(entityType)
            )
            .map((val, i) => (
              <Card
                extra={
                  <Button onClick={() => handleDelete(val.id)}>Delete</Button>
                }
              >
                <img
                  style={{ maxWidth: '100%' }}
                  key={`${val.id}-${i}`}
                  alt={val.title}
                  src={props.awsS3RootPath + val.fileName}
                />
              </Card>
            ))}
        {props.sources &&
          [...props.sources, ...imagePaths]
            // @ts-ignore
            .filter(({ entityType }) => entityType === 'vimeo')
            .map((vid: IMedia, i) => (
              <Card
                extra={
                  <Button onClick={() => handleDelete(vid.id)}>Delete</Button>
                }
              >
                <div
                  key={`${vid}-${i}`}
                  style={{ padding: '56.25% 0 0 0', position: 'relative' }}
                >
                  <iframe
                    src={`${vid.url}?color=ffffff&title=0&byline=0&badge=0`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </Card>
            ))}
      </div>
    </>
  )
}
