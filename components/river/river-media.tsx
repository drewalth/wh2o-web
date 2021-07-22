import {
  Upload,
  message,
  Button,
  Card,
  Modal,
  Form,
  Input,
  Select,
  Empty,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { CreateMediaDto, Media, MediaModel } from 'interfaces'
import {
  createMediaEmbed,
  createMediaFile,
  deleteMedia,
  deletePendingMedia,
} from 'controllers'
import { useAppSelector } from 'store'
import { selectUserData, selectUserIsPublisher } from 'store/slices/user.slice'

interface GalleryProps {
  apiUrl: string
  awsS3RootPath: string
  sources: Media[]
  id: number
}

export const RiverMedia = (props: GalleryProps) => {
  const [imagePaths, setImagePaths] = useState<Media[]>([])
  const [pendingFileName, setPendingFileName] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [form, setForm] = useState<CreateMediaDto>({ ...MediaModel })
  const userIsPublisher = useAppSelector(selectUserIsPublisher)
  const user = useAppSelector(selectUserData)

  const handleDelete = async (id: string | number | undefined) => {
    if (!id) return
    try {
      const result = await deleteMedia(id, props.id)
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

      let method =
        form.mediaType === 'photo' ? createMediaFile : createMediaEmbed

      const result = await method({
        ...form,
        fileName: pendingFileName,
        reachId: props.id,
        userId: user.id,
        // features
        // pick from existing or upload new
      })
      setForm({ ...MediaModel })
      setImagePaths([...imagePaths, result])
      setModalVisible(false)
    } catch (e) {
      console.log(e)
      setSaveError(true)
      message.error('Something went wrong')
    } finally {
      setSaveLoading(false)
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
        destroyOnClose={true}
      >
        <Form
          layout={'vertical'}
          onValuesChange={(evt) => setForm(Object.assign(form, evt))}
          name="basic"
          initialValues={{
            title: '',
            description: '',
            rapid: 0,
            mediaType: 'photo',
          }}
        >
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Entity Type" name="mediaType">
            <Select
              onSelect={(evt) =>
                setForm(Object.assign({}, form, { entityType: evt }))
              }
            >
              <Select.Option value="photo">Photo</Select.Option>
              <Select.Option value="youtube">YouTube</Select.Option>
              <Select.Option value="vimeo">Vimeo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item hidden={form.mediaType !== 'photo'}>
            <Upload
              {...uploadConfig}
              style={{ marginBottom: 24 }}
              onRemove={() => handleCancel(false)}
            >
              <Button icon={<UploadOutlined />}>File Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item hidden={form.mediaType === 'photo'} label="URL" name="url">
            <Input />
          </Form.Item>
          <Form.Item label="Desciption" name="description">
            <Input.TextArea />
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
              ({ entityType }: Media) =>
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
            .map((vid: Media, i) => (
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
      {!props.sources.length && !imagePaths.length && (
        <Empty description="No media" />
      )}
    </>
  )
}
