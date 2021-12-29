import { Gage, Post } from 'types'
import {
  AutoComplete,
  Button,
  Card,
  Form,
  message,
  Modal,
  Table,
  Tag,
} from 'antd'
import { useEffect, useState } from 'react'
import {
  removeBookmarkGage,
  searchGages,
  userBookmarkGage,
} from '../../controllers'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useGagesContext } from '../Provider/GagesProvider'

interface UserPostsProps {
  userId: number
  posts: Post[]
}

export const UserPosts = (props: UserPostsProps) => {
  const { posts, userId } = props
  const { gages: cachedGages, loadGages } = useGagesContext()
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [formBookmarkGage, setFormBookmarkGage] = useState(0)
  const [options, setOptions] = useState<{ label: string; value: number }[]>([])
  const [deletedGages, setDeletedGages] = useState<number[]>([])
  const [recentlyAdded, setRecentlyAdded] = useState<Gage[]>([])

  const router = useRouter()

  const handleDelete = async (gageId: number) => {
    try {
      const result = await removeBookmarkGage(userId, gageId)
      setDeletedGages([...deletedGages, result])
      message.success('Bookmark removed')
    } catch (e) {
      console.log('e', e)
      message.error('Failed to delete')
    }
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      dataIndex: 'published',
      key: 'published',
      render: (published: boolean, val: Post) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          {!val.private && (
            <div>
              <Tag color="blue">Public</Tag>
            </div>
          )}
          {val.published ? (
            <div>
              <Tag color="green">Published</Tag>
            </div>
          ) : (
            <div>
              <Tag color="yellow">Draft</Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt: Date) => (
        <span>{moment(updatedAt).format('LLL')}</span>
      ),
    },
    {
      dataIndex: 'id',
      key: 'id',
      render: (postId: number, val: Post) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Button
            danger
            onClick={() => handleDelete(postId)}
            style={{ marginRight: 8 }}
          >
            Delete
          </Button>
          <Button>
            <Link href={`/posts/${postId}`}>view</Link>
          </Button>
        </div>
      ),
    },
  ]

  const handleOk = async () => {
    try {
      setConfirmLoading(true)
      const result = await userBookmarkGage(
        userId,
        formBookmarkGage,
        !posts.length,
      )
      setRecentlyAdded([...recentlyAdded, result])
      message.success('Gage Bookmarked')
      setModalVisible(false)
      setFormBookmarkGage(0)
    } catch (e) {
      console.log('e', e)
      message.error('Something went wrong')
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleCancel = () => {
    setModalVisible(false)
    setFormBookmarkGage(0)
  }

  const onSearch = async (searchText: string) => {
    try {
      const results = await searchGages(searchText)
      setOptions(
        results.map((val: Gage) => ({ label: val.name, value: val.id })),
      )
    } catch (e) {
      message.error('Failed to search...')
    }
  }

  const onSelect = (evt: any) => {
    const gage = options.find((g) => g.value === evt)
    if (gage) {
      setFormBookmarkGage(gage.value)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (!cachedGages.length) {
        await loadGages()
        await onSearch('')
      }
    })()
  }, [])

  return (
    <>
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 24,
          }}
        >
          <Button type="primary" onClick={() => router.push('/posts/creator')}>
            Create Post
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={[...props.posts].filter(
            (g) => g.id && !deletedGages.includes(g.id),
          )}
        />
      </Card>
      <Modal
        title="Bookmark Gage"
        visible={modalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item label="Gage Name" name="gage" rules={[{ required: true }]}>
            <AutoComplete
              options={options}
              style={{ width: 200 }}
              onSelect={onSelect}
              onSearch={onSearch}
              placeholder="input here"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
