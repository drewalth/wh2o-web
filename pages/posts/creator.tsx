import {
  AutoComplete,
  Card,
  Col,
  Divider,
  message,
  PageHeader,
  Row,
  Spin,
  Switch,
  Tooltip,
  Typography,
} from 'antd'
import { CheckCircleTwoTone, QuestionCircleOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ContentEditor } from '../../components/content-editor'
import debounce from 'lodash.debounce'
import { createPost, searchRiver, updatePost } from '../../controllers'
import { Post, PostType } from 'types'
import { useUserContext } from '../../components/Provider/UserProvider'
import { useRiversContext } from '../../components/Provider/RiversProvider'

const defaultPost: Post = {
  content: '',
  createdAt: new Date(),
  id: 0,
  postType: PostType.INFO,
  private: false,
  published: false,
  reachId: 0,
  subtitle: '',
  updatedAt: new Date(),
  userId: 0,
  title: '',
}

const Creator = () => {
  const router = useRouter()
  const { user } = useUserContext()
  const [form, setForm] = useState<Post>(defaultPost)
  const [loading, setLoading] = useState(false)

  const { rivers: cachedRivers } = useRiversContext()
  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    [...cachedRivers].map((el) => ({ label: el.name, value: el.id })),
  )

  const handleTitleChange = async (evt: string) => {
    if (form.id) {
      await handlePostUpdate(form.content, evt)
    } else {
      await handleCreatePost(evt)
    }
  }

  const handleCreatePost = async (title: string) => {
    try {
      if (!user || form.reachId === 1) return

      const payload = form

      // @ts-ignore
      delete payload.id
      const result = await createPost({
        ...payload,
        title,
        userId: user.id,
      })

      await setForm({ ...result })
    } catch (e) {
      console.log('e', e)
      message.error('Failed to create post')
    }
  }

  const handlePostUpdate = async (html: string, title = '') => {
    if (!form.id) return
    try {
      setLoading(true)
      const payload = {
        ...form,
        content: html,
      }

      if (title) {
        payload.title = title
      }
      const result = await updatePost(payload)
      console.log('result', result)
    } catch (e) {
      message.error('failed to updated')
    } finally {
      setLoading(false)
    }
  }

  const handleVisibilityChange = async (val: boolean) => {
    await setForm({ ...form, private: !val })
    try {
      // @ts-ignore
      const result = await updatePost({ id: form.id, private: !val })
      console.log(result)
    } catch (e) {
      console.log('e', e)
    }
  }

  const onSelect = async (val: string, option: any) => {
    await setForm({
      ...form,
      reachId: option.value,
    })
    try {
      // @ts-ignore
      const result = await updatePost({ id: form.id, reachId: option.value })
      console.log(result)
    } catch (e) {
      console.log('e', e)
    }
  }

  const onSearch = async (searchText: string) => {
    try {
      const results = await searchRiver(searchText)
      setOptions(results.map((val) => ({ label: val.name, value: val.id })))
    } catch (e) {
      message.error('Failed to search...')
    }
  }

  return (
    <>
      <PageHeader onBack={() => router.push('/posts')} title="New Post" />
      <Row gutter={24} align="middle" justify="center">
        <Col span={24} sm={18} lg={16}>
          <Card>
            {form.title && (
              <div style={{ float: 'right' }}>
                {loading ? (
                  <Spin />
                ) : (
                  <CheckCircleTwoTone twoToneColor="#52c41a" />
                )}
              </div>
            )}
            <Typography.Title editable={{ onChange: handleTitleChange }}>
              {!form.title ? 'Title' : form.title}
            </Typography.Title>
            <Typography.Title
              editable={{
                onChange: (subtitle) => setForm({ ...form, subtitle }),
              }}
              level={5}
            >
              {!form.subtitle ? 'Subtitle' : form.subtitle}
            </Typography.Title>
            <AutoComplete
              options={options}
              style={{ width: 300, margin: '8px 0' }}
              onSelect={onSelect}
              onSearch={debounce(onSearch, 500)}
              placeholder="River name..."
            />
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Switch
                style={{ marginTop: 8, marginRight: 8 }}
                onChange={handleVisibilityChange}
                checkedChildren="Public"
                unCheckedChildren="Private"
              />
              <div>
                <Tooltip title="Public posts are visible on associated river pages">
                  <QuestionCircleOutlined />
                </Tooltip>
              </div>
            </div>
            <Divider />
            {!!form.id ? (
              <ContentEditor
                content={''}
                updateFunction={handlePostUpdate}
                entityId={form.id}
                disabled={!form.title}
                placeholder={`<p>Hello world!</p>`}
              />
            ) : (
              <div>Start by adding a title...</div>
            )}
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Creator
