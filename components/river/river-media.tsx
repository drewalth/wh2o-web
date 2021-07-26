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
  Carousel,
  Col,
  Row,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { CSSProperties, useEffect, useState } from 'react'
import { CreateMediaDto, Media, mediaEntityType, MediaModel } from 'interfaces'
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
  const [imagePaths, setImagePaths] = useState<Media[]>([...props.sources])
  const [pendingFileName, setPendingFileName] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [form, setForm] = useState<CreateMediaDto>({ ...MediaModel })
  const userIsPublisher = useAppSelector(selectUserIsPublisher)
  const user = useAppSelector(selectUserData)

  // padding:56.25% 0 0 0;position:relative;
  const VimeoVideoWrapperStyle: CSSProperties = {
    padding: '56.25% 0 0 0',
    position: 'relative',
  }

  const VimeoVideoStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  }

  const contentStyle: CSSProperties = {
    height: '500px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  }

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteMedia(id, props.id)
      console.log(result)
      console.log(imagePaths)
      setImagePaths(imagePaths.filter((img) => img.id !== result))
    } catch (e) {
      console.log('e', e)
      message.error('Something went wrong...')
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
    // headers: {
    //   authorization: "authorization-text",
    // },
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

  const getVimeoUrl = (url: string | undefined): string => {
    if (!url) return ''

    const urlSegments = url.split('/')
    const videoId = urlSegments[urlSegments.length - 1]

    return `https://player.vimeo.com/video/${videoId}`
  }

  const getMediaHTML = (media: Media) => {
    switch (media.mediaType) {
      case 'photo':
        return (
          <img
            style={{ maxWidth: '100%' }}
            key={`${media.id}`}
            alt={media.title}
            src={props.awsS3RootPath + media.fileName}
          />
        )
      case 'youtube':
        return (
          <div style={VimeoVideoWrapperStyle}>
            <iframe
              style={VimeoVideoStyle}
              src={media.url}
              title="YouTube video player"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        )
      case 'vimeo':
        return (
          <div style={VimeoVideoWrapperStyle}>
            <iframe
              src={getVimeoUrl(media.url)}
              style={VimeoVideoStyle}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        )
      default:
        return <div>wut</div>
    }
  }

  // useEffect(() => {
  //   const existingScriptTag = document.querySelector("#vimeo-player-js");
  //
  //   if (imagePaths.map((el) => el.mediaType).includes(mediaEntityType.vimeo)) {
  //     if (existingScriptTag) return;
  //
  //     const tag = document.createElement("script");
  //     tag.id = "vimeo-player-js";
  //     tag.src = "https://player.vimeo.com/api/player.js";
  //
  //     const parent = document.querySelector("body");
  //
  //     if (parent) {
  //       parent.appendChild(tag);
  //     }
  //   } else {
  //     if (existingScriptTag) {
  //       existingScriptTag.remove();
  //     }
  //   }
  // }, [imagePaths]);

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
        <Carousel dotPosition={'bottom'}>
          {imagePaths.length &&
            imagePaths.map((val, i) => (
              <div>
                <Row style={contentStyle}>
                  <Col
                    span={24}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div>{getMediaHTML(val)}</div>
                  </Col>
                </Row>
              </div>
            ))}
        </Carousel>
      </div>
      {!props.sources.length && !imagePaths.length && (
        <Empty description="No media" />
      )}
    </>
  )
}