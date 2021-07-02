import { useState } from 'react'
import { IPost, PostModel } from 'interfaces'
import { createPost, deletePost } from 'controllers'
import { Modal, Form, Input, message, Button, Spin, Select, Empty } from 'antd'
import { useAppSelector } from 'store'
import { selectUserData, selectUserIsPublisher } from 'store/slices/user.slice'

interface BoardProps {
  riverId: number
  posts: IPost[]
}

interface BoardState {
  loading: boolean
  error: boolean
  modalVisible: boolean
  saveLoading: boolean
}

export const Board = (props: BoardProps) => {
  const { riverId, posts: data } = props
  const userIsPublisher = useAppSelector(selectUserIsPublisher)
  const user = useAppSelector(selectUserData)
  const [form, setForm] = useState<IPost>({
    ...PostModel,
    riverId,
    authorId: user.id || 0,
  })
  const [state, setState] = useState<BoardState>({
    loading: false,
    error: false,
    saveLoading: false,
    modalVisible: false,
  })

  const [posts, setPosts] = useState<IPost[]>([...data])

  const handleCancel = () => {
    setState({ ...state, modalVisible: false })
    setForm({ ...PostModel })
  }

  const handleSave = async () => {
    try {
      setState({ ...state, saveLoading: true, error: false })
      const result = await createPost(form)
      setPosts([...posts, result])
      message.success('Post Created')
    } catch (e) {
      console.log('e', e)
      setState({ ...state, error: true })
      message.error('Something went wrong...')
    } finally {
      setState({ ...state, saveLoading: false, modalVisible: state.error })
    }
  }

  const handleDeletePost = async (id: string | number) => {
    try {
      const result = await deletePost(id)
      setPosts(posts.filter((p) => p.id !== result.id))
      message.success('Post Deleted')
    } catch (e) {
      console.log('e', e)
      message.error('Failed to delete')
    }
  }

  if (state.loading) {
    return <Spin />
  }

  return (
    <div>
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
          onClick={() => setState({ ...state, modalVisible: true })}
        >
          Add Post
        </Button>
      </div>
      {posts.map((post, index) => (
        <div key={index}>
          <Button onClick={() => handleDeletePost(post.id)}>Delete</Button>
        </div>
      ))}
      {!posts.length && <Empty description="No posts" />}
      <Modal
        destroyOnClose={true}
        confirmLoading={state.saveLoading}
        visible={state.modalVisible}
        onCancel={handleCancel}
        onOk={handleSave}
      >
        <Form
          initialValues={form}
          onValuesChange={(evt) => setForm({ ...form, ...evt })}
        >
          <Form.Item label="Post Type" name="postType">
            <Select>
              <Select.Option value="INFO">Info</Select.Option>
              <Select.Option value="ALERT">Alert</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Message" name="content">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
